import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagePresenter } from '../presenter/message.presenter';
import { ActivityService } from 'src/activity/activity.service';
import { ActivityGateway } from 'src/activity/activity.gateway';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelType } from 'src/channel/dto/create-channel.dto';

/** Extract all @userId mentions from HTML message content */
function extractMentions(content: string): string[] {
    const matches = content.match(/data-id="([^"]+)"/g) ?? [];
    return matches.map((m) => m.replace(/data-id="|"/g, ''));
}

/** Strip HTML tags for a short preview */
function toPreview(html: string, maxLen = 80): string {
    const plain = html.replace(/<[^>]*>/g, '').trim();
    return plain.length > maxLen ? plain.slice(0, maxLen) + '…' : plain;
}

@WebSocketGateway({ cors: true })
export class MessageGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly presenter: MessagePresenter,
        private readonly activityService: ActivityService,
        private readonly activityGateway: ActivityGateway,
        private readonly channelService: ChannelService,
    ) {}

    @SubscribeMessage('join_channel')
    async handleJoin(client: Socket, payload: { channelId: string; userId: string }) {
        const { channelId, userId } = payload;

        let channel: Awaited<ReturnType<ChannelService['getChannelById']>> | null = null;
        try {
            channel = await this.channelService.getChannelById(channelId);
        } catch {
            client.emit('channel:access_denied', { message: 'Channel not found' });
            return;
        }

        if (channel.channelType === ChannelType.PRIVATE) {
            const member = await this.channelService.isMember(channelId, userId);
            if (!member) {
                client.emit('channel:access_denied', { message: 'You are not a member of this channel' });
                return;
            }
        }

        client.join(channelId);
    }

    @SubscribeMessage('leave_channel')
    handleLeave(client: Socket, channelId: string) {
        client.leave(channelId);
    }

    @SubscribeMessage('send_message')
    async handleMessage(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
        let channel: Awaited<ReturnType<ChannelService['getChannelById']>> | null = null;
        try {
            channel = await this.channelService.getChannelById(payload.channelId);
        } catch {
            client.emit('channel:access_denied', { message: 'Channel not found' });
            return;
        }

        if (channel.channelType === ChannelType.PRIVATE) {
            const member = await this.channelService.isMember(payload.channelId, payload.senderId);
            if (!member) {
                client.emit('channel:access_denied', { message: 'You are not a member of this channel' });
                return;
            }
        }

        const message = await this.presenter.sendMessage(payload);
        const preview = toPreview(payload.content ?? '');
        const actor = message.sender;
        const actorUsername: string = actor?.dispname || actor?.email || 'Someone';
        const actorAvatar: string = actor?.avatar ?? '/uploads/avatar.png';

        if (payload.parentId) {
            this.server.to(payload.channelId).emit('new_thread_message', message);
            const [rootMessage] = await this.presenter.getThread(payload.parentId);
            if (rootMessage) {
                this.server.to(payload.channelId).emit('thread_updated', rootMessage);

                // Activity: reply — notify the root message sender (if different)
                const rootSenderId: string = rootMessage.sender?.id;
                if (rootSenderId && rootSenderId !== payload.senderId) {
                    const activity = await this.activityService.create({
                        recipientId: rootSenderId,
                        actorId: payload.senderId,
                        actorUsername,
                        actorAvatar,
                        type: 'reply',
                        messagePreview: preview,
                        messageId: message.id,
                        channelId: payload.channelId,
                        workspaceId: payload.workspaceId,
                    });
                    this.activityGateway.emitToUser(rootSenderId, activity);
                }
            }
        } else {
            this.server.to(payload.channelId).emit('new_message', message);

            // Activity: mentions — notify each mentioned user
            const mentionedIds = extractMentions(payload.content ?? '');
            for (const recipientId of mentionedIds) {
                if (recipientId === payload.senderId) continue;
                const activity = await this.activityService.create({
                    recipientId,
                    actorId: payload.senderId,
                    actorUsername,
                    actorAvatar,
                    type: 'mention',
                    messagePreview: preview,
                    messageId: message.id,
                    channelId: payload.channelId,
                    workspaceId: payload.workspaceId,
                });
                this.activityGateway.emitToUser(recipientId, activity);
            }
        }

        return message;
    }

    @SubscribeMessage('toggle_reaction')
    async handleReactionToggle(
        @MessageBody() payload: {
            channelId: string;
            messageId: string;
            reactions: any[];
            senderId?: string;
            messageOwnerId?: string;
            workspaceId?: string;
            actorUsername?: string;
            actorAvatar?: string;
            emoji?: string;
        },
    ) {
        this.server.to(payload.channelId).emit('reaction_updated', {
            messageId: payload.messageId,
            reactions: payload.reactions,
        });

        // Activity: reaction — notify the message owner (if different from reactor)
        if (
            payload.messageOwnerId &&
            payload.senderId &&
            payload.messageOwnerId !== payload.senderId
        ) {
            const activity = await this.activityService.create({
                recipientId: payload.messageOwnerId,
                actorId: payload.senderId,
                actorUsername: payload.actorUsername ?? 'Someone',
                actorAvatar: payload.actorAvatar ?? '/uploads/avatar.png',
                type: 'reaction',
                messagePreview: payload.emoji ? `Reacted with ${payload.emoji}` : 'Reacted to your message',
                messageId: payload.messageId,
                channelId: payload.channelId,
                workspaceId: payload.workspaceId,
            });
            this.activityGateway.emitToUser(payload.messageOwnerId, activity);
        }
    }

    @SubscribeMessage('message_edit')
    handleMessageEdit(
        @MessageBody() payload: { channelId: string; messageId: string; content: string; updatedAt: string },
    ) {
        this.server.to(payload.channelId).emit('messageEdited', {
            messageId: payload.messageId,
            content: payload.content,
            updatedAt: payload.updatedAt,
        });
    }

    @SubscribeMessage('message_delete')
    handleMessageDelete(
        @MessageBody() payload: { channelId: string; messageId: string; updatedRoot?: any },
    ) {
        this.server.to(payload.channelId).emit('messageDeleted', { messageId: payload.messageId });
        if (payload.updatedRoot) {
            this.server.to(payload.channelId).emit('thread_updated', payload.updatedRoot);
        }
    }
}
