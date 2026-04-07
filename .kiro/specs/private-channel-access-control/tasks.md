# Implementation Plan: Private Channel Access Control

## Overview

Enforce private channel access control across all layers: ChannelService (filtered queries, invite logic), ChannelGateway (list filtering, invite event), MessageGateway (join/send membership checks), MembershipGuard (REST), ChannelController (join block), and the Next.js frontend (invite step, access_denied handler, URL guard).

## Tasks

- [x] 1. Extend ChannelService with membership-aware methods
  - [x] 1.1 Add `getChannelsForUser(workspaceId, userId)` using a LEFT JOIN query builder that returns public channels plus private channels where the user is a member
    - Use `createQueryBuilder` with `leftJoinAndSelect('channel.members', 'member')` and `WHERE channelType = 'public' OR member.id = :userId`
    - _Requirements: 1.1, 1.4_

  - [ ]* 1.2 Write property test for `getChannelsForUser` (Property 1)
    - **Property 1: Channel list visibility filtering**
    - Generate arbitrary channel sets (public/private) and users; assert result contains exactly public channels plus private channels where user is a member
    - **Validates: Requirements 1.1, 1.2**

  - [x] 1.3 Extend `createChannel` to accept `invitedUserIds?: string[]`, bulk-load valid users, add them to `members` alongside the creator for private channels, and ignore `invitedUserIds` for public channels
    - Skip invalid/missing user IDs silently
    - _Requirements: 5.4, 5.5, 5.6, 5.7_

  - [ ]* 1.4 Write property test for `createChannel` with `invitedUserIds` (Property 8 partial, Property 9)
    - **Property 8: Invite members round-trip (creation path)**
    - Generate mixes of valid and invalid user IDs; assert only valid ones appear in members after creation
    - **Property 9: Public channel creation ignores invitedUserIds**
    - Assert public channel always yields empty members regardless of `invitedUserIds`
    - **Validates: Requirements 5.4, 5.5, 5.7**

  - [x] 1.5 Add `isMember(channelId, userId): Promise<boolean>` helper that queries the members join table
    - _Requirements: 2.1, 3.1, 4.1_

  - [x] 1.6 Add `inviteMembers(channelId, requestingUserId, invitedUserIds)` that verifies the requesting user is the creator, bulk-loads valid users, adds them to members, and throws `ForbiddenException` for non-creators and `BadRequestException` for public channels
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [ ]* 1.7 Write property test for `inviteMembers` (Property 7, Property 8 post-creation path)
    - **Property 7: Only the creator can invite to a private channel**
    - Generate arbitrary channels and users (creator/non-creator); assert invite succeeds iff requesting user is creator
    - **Property 8: Invite members round-trip (post-creation path)**
    - Generate mixes of valid/invalid user IDs; assert only valid ones appear in members after invite
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 2. Update ChannelPresenter to expose new service methods
  - Add `getChannelsForUser(workspaceId, userId)` and `inviteMembers(channelId, requestingUserId, invitedUserIds)` delegating to `ChannelService`
  - _Requirements: 1.1, 6.3_

- [ ] 3. Update ChannelGateway with filtered list, invite event, and userId validation
  - [x] 3.1 Modify `channel:list` handler to require `userId` in payload, emit `channel:error` if absent, and delegate to `presenter.getChannelsForUser`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.2 Modify `channel:create` handler to forward `invitedUserIds` from payload to `presenter.createChannel`
    - _Requirements: 5.3, 5.4_

  - [x] 3.3 Add `channel:invite` handler: validate requesting user is creator via `presenter.inviteMembers`, emit `channel:updated` to the channel room on success, emit `channel:error` on failure
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 4. Update MessageGateway with membership enforcement
  - [x] 4.1 Inject `ChannelService` into `MessageGateway`; update `join_channel` handler to accept `{ channelId, userId }` payload, call `isMember` for private channels, emit `channel:access_denied` for non-members or missing channels, and only call `client.join(channelId)` on success
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 4.2 Write property test for join enforcement (Property 2)
    - **Property 2: Private channel join enforcement**
    - Generate arbitrary private channels and users (member/non-member); assert join succeeds iff user is member
    - **Validates: Requirements 2.1, 2.2, 2.3**

  - [x] 4.3 Update `send_message` handler to call `isMember` for private channels and emit `channel:access_denied` if the sender is not a member or the channel is not found, without persisting or broadcasting
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 4.4 Write property test for send enforcement (Property 3)
    - **Property 3: Private channel message send enforcement**
    - Generate arbitrary private channels and senders; assert message persisted iff sender is member
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 5. Checkpoint — Ensure all backend service and gateway tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement MembershipGuard and apply to ChannelController
  - [x] 6.1 Create `be/src/channel/guards/membership.guard.ts` implementing `CanActivate`: read `channelId` from `request.params`, read `userId` from `request.body` or `request.query`, call `ChannelService.isMember`, throw `ForbiddenException('You are not a member of this channel')` for non-members of private channels
    - _Requirements: 4.1, 4.2, 4.3, 4.6_

  - [ ]* 6.2 Write property test for MembershipGuard (Property 4)
    - **Property 4: REST membership guard on private channel GET**
    - Generate arbitrary channels (public/private) and users; assert guard allows iff public or member
    - **Validates: Requirements 4.1, 4.2, 4.3**

  - [x] 6.3 Apply `MembershipGuard` to `GET /channels/:id` in `ChannelController`; update `ChannelModule` to provide `MembershipGuard` and `ChannelService` in the guard's scope
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 6.4 Modify `POST /channels/:id/join` in `ChannelController` to return HTTP 403 with `"Private channels require an invitation"` when the channel is private, and proceed with `joinChannel` for public channels
    - _Requirements: 4.4, 4.5_

  - [ ]* 6.5 Write property tests for REST join endpoint (Property 5, Property 6)
    - **Property 5: REST join blocked for private channels**
    - Assert POST /join always returns 403 for any private channel
    - **Property 6: Public channel join via REST is a round-trip**
    - Assert POST /join adds user and subsequent GET confirms membership
    - **Validates: Requirements 4.4, 4.5**

- [ ] 7. Add invite step to CreateChannelModal (frontend)
  - [x] 7.1 Add `invitedUserIds` state and a step-3 UI to `CreateChannelModal`: fetch workspace members, render a search input filtered by `dispname`/`email` (case-insensitive), allow multi-select, show "Step 3 of 3" indicator when `visibility === 'private'`
    - _Requirements: 5.1, 5.2, 7.5, 7.6_

  - [ ]* 7.2 Write property test for member search filter (Property 10)
    - **Property 10: Member search filtering**
    - Generate arbitrary user lists and search strings; assert filter returns exactly users whose dispname or email contains the string (case-insensitive)
    - **Validates: Requirements 5.2**

  - [x] 7.3 Update `handleCreate` in `CreateChannelModal` to include `invitedUserIds` in the `channel:create` socket payload
    - _Requirements: 5.3_

- [ ] 8. Add frontend access control handlers and URL guard
  - [x] 8.1 Add a `channel:access_denied` socket listener (in SocketProvider or the channel page) that shows a non-blocking toast notification and does not update active channel state
    - _Requirements: 7.3, 7.4_

  - [x] 8.2 Add a URL guard to the channel page: on mount, check if the target channel is present in the user's filtered channel list; if not, redirect to the workspace default view
    - _Requirements: 7.2_

  - [x] 8.3 Ensure `join_channel` and `send_message` socket payloads include the current user's `id` from channel state
    - _Requirements: 7.4_

- [ ] 9. Add member list display to the channel view
  - [x] 9.1 Render the `members` array (returned by `getChannelsForUser` / `getChannelById`) in the private channel sidebar or header, showing each member's `dispname` and `avatar`
    - _Requirements: 8.1, 8.3_

  - [ ]* 9.2 Write property test for member list display completeness (Property 11)
    - **Property 11: Member list display completeness**
    - Generate arbitrary member arrays; assert rendered output contains dispname and avatar for each member
    - **Validates: Requirements 8.1, 8.3**

  - [x] 9.3 Subscribe to `channel:updated` events and update the displayed member list in-place without a page reload
    - _Requirements: 8.2_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use [fast-check](https://github.com/dubzzz/fast-check)
- Each task references specific requirements for traceability
- No schema changes are needed — `Channel.channelType` and `Channel.members` already exist
