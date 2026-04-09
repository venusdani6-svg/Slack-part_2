//channel.service.ts

/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { ChannelType } from './dto/create-channel.dto';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelRepo: Repository<Channel>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(Workspace)
        private workspaceRepo: Repository<Workspace>,
    ) { }

    async updateChannel(payload: {
        channelId: string;
        name?: string;
        type?: ChannelType;
        userId: string;
    }) {
        const { channelId, name, type, userId } = payload;

        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
        });

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        if (channel.creatorId && channel.creatorId !== userId) {
            throw new ForbiddenException('You can only edit channels you created');
        }

        if (name) channel.name = name;
        if (type) channel.channelType = type;

        return await this.channelRepo.save(channel);
    }

    async joinChannel(channelId: string, userId: string) {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: ['members'],
        });

        if (!channel) throw new NotFoundException('Channel not found');

        const user = await this.userRepo.findOne({
            where: { id: userId },
        });
        if (!user) throw new NotFoundException('User not found');
        if (!channel.members) { channel.members = []; }
        if (!channel.members.find(m => m.id === user.id)) {
            channel.members.push(user);
        }

        return this.channelRepo.save(channel);
    }

    async getChannels(workspaceId: string) {
        if (!workspaceId) {
            throw new BadRequestException('workspaceId is required');
        }

        const channels = await this.channelRepo.find({
            where: { workspace: { id: workspaceId } },
            relations: ['members'],
        });

        return channels;
    }


    async createChannel(data: {
        name: string;
        workspaceId: string;
        userId: string;
        type: ChannelType;
        invitedUserIds?: string[];
    }) {
        const { name, workspaceId, userId, type, invitedUserIds } = data;

        if (!name || !workspaceId || !userId || !type) {
            throw new BadRequestException('Missing required fields');
        }

        // find workspace
        const workspace = await this.workspaceRepo.findOne({
            where: { id: workspaceId },
        });

        if (!workspace) {
            throw new NotFoundException('Workspace not found');
        }

        //  find user
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // check duplicate channel name (optional but important)
        const existing = await this.channelRepo.findOne({
            where: {
                name,
                workspace: { id: workspaceId },
            },
        });

        if (existing) {
            throw new BadRequestException('Channel already exists');
        }

        // create channel
        const channel = this.channelRepo.create({
            name,
            workspace,
            channelType: type,
            creatorId: userId,
            members: type === ChannelType.PRIVATE ? [user] : [],
        });

        if (type === ChannelType.PRIVATE && invitedUserIds && invitedUserIds.length > 0) {
            const validUsers = await this.userRepo.findBy({ id: In(invitedUserIds) });
            const existingIds = new Set(channel.members.map(m => m.id));
            for (const invitedUser of validUsers) {
                if (!existingIds.has(invitedUser.id)) {
                    channel.members.push(invitedUser);
                }
            }
        }

        return await this.channelRepo.save(channel);
    }

    async getChannelsForUser(workspaceId: string, userId: string): Promise<Channel[]> {
        return this.channelRepo
            .createQueryBuilder('channel')
            .leftJoinAndSelect('channel.members', 'member')
            .where('channel.workspaceId = :workspaceId', { workspaceId })
            .andWhere('(channel.channelType = :public OR member.id = :userId)', { public: ChannelType.PUBLIC, userId })
            .getMany();
    }

    async isMember(channelId: string, userId: string): Promise<boolean> {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: ['members'],
        });
        if (!channel) return false;
        return channel.members.some(m => m.id === userId);
    }

    async inviteMembers(channelId: string, requestingUserId: string, invitedUserIds: string[]): Promise<Channel> {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: ['members'],
        });

        if (!channel) throw new NotFoundException('Channel not found');

        if (channel.channelType === ChannelType.PUBLIC) {
            throw new BadRequestException('Cannot invite members to a public channel');
        }

        if (channel.creatorId !== requestingUserId) {
            throw new ForbiddenException('Only the channel creator can invite members');
        }

        const validUsers = await this.userRepo.findBy({ id: In(invitedUserIds) });
        const existingIds = new Set(channel.members.map(m => m.id));
        for (const user of validUsers) {
            if (!existingIds.has(user.id)) {
                channel.members.push(user);
            }
        }

        return this.channelRepo.save(channel);
    }

    async getChannelById(channelId: string) {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
            relations: ['members'],
        });
        if (!channel) throw new NotFoundException('Channel not found');
        return channel;
    }

    async deleteChannel(channelId: string, userId: string) {
        const channel = await this.channelRepo.findOne({
            where: { id: channelId },
        });

        if (!channel) throw new NotFoundException('Channel not found');

        if (channel.creatorId && channel.creatorId !== userId) {
            throw new ForbiddenException('You can only delete channels you created');
        }

        await this.channelRepo.delete(channelId);
        return { id: channelId };
    }
}

