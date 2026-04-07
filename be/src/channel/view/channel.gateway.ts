import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChannelPresenter } from '../presenter/channel.presenter';

/**
 * Channel View (WebSocket) — socket interface only. No business logic.
 * Delegates everything to ChannelPresenter.
 */
@WebSocketGateway({ cors: { origin: '*', credentials: true } })
export class ChannelGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly presenter: ChannelPresenter) {}

    @SubscribeMessage('channel:list')
    async handleList(client: Socket, payload: { workspaceId: string; userId: string }) {
        if (!payload.userId) {
            client.emit('channel:error', { message: 'userId is required' });
            return;
        }
        const channels = await this.presenter.getChannelsForUser(payload.workspaceId, payload.userId);
        client.emit('channel:list', channels);
    }

    @SubscribeMessage('channel:create')
    async handleCreate(@MessageBody() payload: { name: string; workspaceId: string; userId: string; type: any; invitedUserIds?: string[] }) {
        const channel = await this.presenter.createChannel(payload);
        this.server.emit('channel:created', channel);
    }

    @SubscribeMessage('channel:invite')
    async handleInvite(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { channelId: string; invitedUserIds: string[]; requestingUserId: string },
    ) {
        try {
            const updatedChannel = await this.presenter.inviteMembers(
                payload.channelId,
                payload.requestingUserId,
                payload.invitedUserIds,
            );
            this.server.to(payload.channelId).emit('channel:updated', updatedChannel);
        } catch (err) {
            if (err instanceof ForbiddenException || err instanceof NotFoundException || err instanceof BadRequestException) {
                client.emit('channel:error', { message: err.message });
            } else {
                client.emit('channel:error', { message: 'Failed to invite members' });
            }
        }
    }

    @SubscribeMessage('channel:delete')
    async handleDelete(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { channelId: string; workspaceId: string; userId: string },
    ) {
        try {
            await this.presenter.deleteChannel(payload.channelId, payload.userId);
            this.server.emit('channel:deleted', { channelId: payload.channelId });
        } catch (err) {
            if (err instanceof ForbiddenException || err instanceof NotFoundException) {
                client.emit('channel:error', { message: err.message });
            } else {
                client.emit('channel:error', { message: 'Failed to delete channel' });
            }
        }
    }

    @SubscribeMessage('channel:update')
    async handleUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: any,
    ) {
        try {
            const updatedChannel = await this.presenter.updateChannel(payload);
            this.server.emit('channel:updated', updatedChannel);
            return updatedChannel;
        } catch (err) {
            if (err instanceof ForbiddenException || err instanceof NotFoundException) {
                client.emit('channel:error', { message: err.message });
            } else {
                client.emit('channel:error', { message: 'Failed to update channel' });
            }
        }
    }
}
