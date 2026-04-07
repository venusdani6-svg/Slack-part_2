# Requirements Document

## Introduction

This feature adds private channel access control to the existing Slack-like application. Currently, channels have a `channelType` field (public/private) and a `members` ManyToMany relation, but no enforcement exists: any authenticated user can join any socket room, send messages to any channel, and see all channels regardless of type. This feature closes those gaps by enforcing membership at every layer — WebSocket, REST, and frontend — and by providing an invite flow so private channel creators can add members during channel creation.

## Glossary

- **Channel**: A named communication room within a Workspace, typed as either `public` or `private`.
- **ChannelType**: An enum with values `public` and `private`, stored on the Channel entity.
- **Member**: A User who has been added to a Channel's `members` ManyToMany relation.
- **Creator**: The User whose `id` matches `channel.creatorId`; automatically a Member of any private Channel they create.
- **Invite**: The act of a Creator adding one or more Users to a private Channel's `members` list at creation time or afterward.
- **MembershipGuard**: A NestJS guard that verifies the requesting User is a Member of the target Channel before allowing access.
- **ChannelService**: The NestJS service responsible for Channel persistence and business logic.
- **ChannelPresenter**: The NestJS presenter that mediates between Channel views (gateway + controller) and ChannelService.
- **ChannelGateway**: The NestJS WebSocket gateway handling `channel:*` events.
- **MessageGateway**: The NestJS WebSocket gateway handling `join_channel`, `send_message`, and related message events.
- **ChannelController**: The NestJS REST controller for Channel HTTP endpoints.
- **CreateChannelModal**: The Next.js frontend modal component used to create a new Channel.
- **SocketProvider**: The Next.js context provider that exposes the Socket.io client instance.
- **Workspace**: The top-level container that owns Channels and Users.

---

## Requirements

### Requirement 1: Channel List Visibility Filtering

**User Story:** As a workspace member, I want the channel list to show only public channels and private channels I belong to, so that I am not aware of private conversations I have not been invited to.

#### Acceptance Criteria

1. WHEN a `channel:list` WebSocket event is received with a `workspaceId` and `userId`, THE ChannelGateway SHALL return only channels where `channelType` is `public` OR the requesting User is present in the channel's `members` relation.
2. WHEN the `channel:list` response is emitted, THE ChannelGateway SHALL include each channel's `id`, `name`, `channelType`, and `members` array.
3. IF `userId` is absent from the `channel:list` payload, THEN THE ChannelGateway SHALL emit a `channel:error` event with the message `"userId is required"`.
4. THE ChannelService SHALL filter channels by workspace and apply the visibility rule in a single database query using a LEFT JOIN on members.

### Requirement 2: Private Channel Membership Enforcement on WebSocket Join

**User Story:** As a system operator, I want WebSocket room joins for private channels to be restricted to members only, so that non-members cannot receive real-time messages from private channels.

#### Acceptance Criteria

1. WHEN a `join_channel` WebSocket event is received, THE MessageGateway SHALL retrieve the target Channel and verify the requesting User is a Member before calling `client.join(channelId)`.
2. IF the target Channel has `channelType` of `private` AND the requesting User is not a Member, THEN THE MessageGateway SHALL emit a `channel:access_denied` event to the requesting client with the message `"You are not a member of this channel"` and SHALL NOT add the client to the socket room.
3. WHEN the target Channel has `channelType` of `public`, THE MessageGateway SHALL add the client to the socket room without a membership check.
4. IF the target Channel does not exist, THEN THE MessageGateway SHALL emit a `channel:access_denied` event with the message `"Channel not found"`.
5. THE `join_channel` payload SHALL include both `channelId` and `userId` fields.

### Requirement 3: Private Channel Membership Enforcement on Message Send

**User Story:** As a system operator, I want message sending to be restricted to channel members for private channels, so that non-members cannot inject messages into private conversations.

#### Acceptance Criteria

1. WHEN a `send_message` WebSocket event is received for a Channel with `channelType` of `private`, THE MessageGateway SHALL verify the `senderId` is a Member of the target Channel before persisting or broadcasting the message.
2. IF the `senderId` is not a Member of a private Channel, THEN THE MessageGateway SHALL emit a `channel:access_denied` event to the sending client with the message `"You are not a member of this channel"` and SHALL NOT persist or broadcast the message.
3. WHEN a `send_message` event is received for a Channel with `channelType` of `public`, THE MessageGateway SHALL process the message without a membership check.
4. IF the target Channel does not exist during a `send_message` event, THEN THE MessageGateway SHALL emit a `channel:access_denied` event with the message `"Channel not found"`.

### Requirement 4: REST Endpoint Membership Guard

**User Story:** As a system operator, I want REST endpoints that access channel data to enforce membership for private channels, so that non-members cannot retrieve private channel information via HTTP.

#### Acceptance Criteria

1. WHEN `GET /channels/:id` is called for a Channel with `channelType` of `private`, THE ChannelController SHALL verify the requesting User is a Member before returning channel data.
2. IF the requesting User is not a Member of a private Channel, THEN THE ChannelController SHALL return HTTP 403 with the message `"You are not a member of this channel"`.
3. WHEN `GET /channels/:id` is called for a Channel with `channelType` of `public`, THE ChannelController SHALL return channel data without a membership check.
4. WHEN `POST /channels/:id/join` is called for a Channel with `channelType` of `private`, THE ChannelController SHALL return HTTP 403 with the message `"Private channels require an invitation"` and SHALL NOT add the User to the members list.
5. WHEN `POST /channels/:id/join` is called for a Channel with `channelType` of `public`, THE ChannelController SHALL add the User to the members list and return the updated Channel.
6. THE MembershipGuard SHALL be implemented as a reusable NestJS guard applicable to any route that requires channel membership verification.

### Requirement 5: Private Channel Invite Flow During Creation

**User Story:** As a channel creator, I want to invite members when creating a private channel, so that the channel is immediately accessible to the intended participants.

#### Acceptance Criteria

1. WHEN a user selects `private` visibility in the CreateChannelModal and advances past the visibility step, THE CreateChannelModal SHALL display a member search and selection step before the final create action.
2. THE CreateChannelModal SHALL allow the creator to search workspace members by display name or email and select one or more users to invite.
3. WHEN the creator submits the create action, THE CreateChannelModal SHALL include the selected `invitedUserIds` array in the `channel:create` socket payload alongside `workspaceId`, `name`, `type`, and `userId`.
4. WHEN a `channel:create` event is received with `type` of `private` and a non-empty `invitedUserIds` array, THE ChannelService SHALL add all valid invited Users to the channel's `members` relation in addition to the Creator.
5. IF an `invitedUserIds` entry does not correspond to an existing User, THEN THE ChannelService SHALL skip that entry and continue processing remaining valid user IDs.
6. WHEN a `channel:create` event is received with `type` of `private` and an empty or absent `invitedUserIds`, THE ChannelService SHALL create the channel with only the Creator as a Member.
7. WHEN a `channel:create` event is received with `type` of `public`, THE ChannelService SHALL ignore any `invitedUserIds` and create the channel with an empty members list.

### Requirement 6: Post-Creation Member Invite

**User Story:** As a private channel creator, I want to invite additional members after the channel has been created, so that I can grow the channel's membership over time.

#### Acceptance Criteria

1. WHEN a `channel:invite` WebSocket event is received with `channelId`, `invitedUserIds`, and `requestingUserId`, THE ChannelGateway SHALL verify the requesting User is the Creator of the target Channel before adding members.
2. IF the requesting User is not the Creator of the target Channel, THEN THE ChannelGateway SHALL emit a `channel:error` event with the message `"Only the channel creator can invite members"`.
3. WHEN the invite is authorized, THE ChannelService SHALL add each valid User from `invitedUserIds` to the channel's `members` relation and return the updated Channel.
4. WHEN the invite succeeds, THE ChannelGateway SHALL emit a `channel:updated` event to all members of the channel's socket room with the updated member list.
5. IF the target Channel has `channelType` of `public`, THEN THE ChannelGateway SHALL emit a `channel:error` event with the message `"Cannot invite members to a public channel"`.

### Requirement 7: Frontend Channel Access Validation

**User Story:** As a frontend user, I want the UI to prevent me from navigating into or interacting with private channels I am not a member of, so that I never see an empty or broken channel view.

#### Acceptance Criteria

1. WHEN the frontend channel list is rendered, THE frontend SHALL display only channels returned by the filtered `channel:list` response (public channels and private channels where the user is a member).
2. WHEN a user attempts to navigate to a private channel by URL and the user is not a Member, THE frontend SHALL redirect the user to the workspace default view.
3. WHEN the `channel:access_denied` WebSocket event is received, THE frontend SHALL display a non-blocking error notification to the user and SHALL NOT update the active channel state.
4. THE frontend channel state management SHALL store the current user's `id` and use it in all `join_channel` and `send_message` payloads.
5. WHEN the CreateChannelModal is open and `private` visibility is selected, THE CreateChannelModal SHALL render the invite step as step 3 of 3, updating the step indicator accordingly.
6. THE CreateChannelModal SHALL be SSR-safe: all socket interactions and client-only state SHALL be guarded with `"use client"` and SHALL NOT cause hydration mismatches.

### Requirement 8: Channel Member List Display

**User Story:** As a channel member, I want to see who else is in a private channel, so that I know who can read the conversation.

#### Acceptance Criteria

1. WHEN a user views a private channel they are a Member of, THE frontend SHALL display the list of current Members including their display name and avatar.
2. WHEN a `channel:updated` event is received for the currently active channel, THE frontend SHALL update the displayed member list without requiring a page reload.
3. THE ChannelService SHALL return the `members` relation (including `id`, `dispname`, `email`, and `avatar` fields) on all channel fetch operations used by the member list display.
