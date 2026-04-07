import { Controller, Post, Body, Param, Get, UseGuards, ForbiddenException } from '@nestjs/common';
import { ChannelPresenter } from '../presenter/channel.presenter';
import { MembershipGuard } from '../guards/membership.guard';

/**
 * Channel View (REST) — HTTP interface only. No business logic.
 * Delegates everything to ChannelPresenter.
 */
@Controller('channels')
export class ChannelController {
    constructor(private readonly presenter: ChannelPresenter) {}

    /** GET /api/channels/:id — returns channel with members array */
    @UseGuards(MembershipGuard)
    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.presenter.getChannelById(id);
    }

    /** POST /api/channels/:id/join */
    @Post(':id/join')
    async join(@Param('id') id: string, @Body('userId') userId: string) {
        const channel = await this.presenter.getChannelById(id);
        if (channel.channelType === 'private') {
            throw new ForbiddenException('Private channels require an invitation');
        }
        return this.presenter.joinChannel(id, userId);
    }
}
