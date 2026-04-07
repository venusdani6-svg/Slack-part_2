import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ChannelService } from '../channel.service';
import { ChannelType } from '../dto/create-channel.dto';

@Injectable()
export class MembershipGuard implements CanActivate {
  constructor(private readonly channelService: ChannelService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const channelId: string = request.params?.id;
    const userId: string = request.body?.userId ?? request.query?.userId;

    if (!channelId || !userId) return true; // let controller handle missing params

    const channel = await this.channelService.getChannelById(channelId).catch(() => null);
    if (!channel) return true; // let controller handle not found

    if (channel.channelType === ChannelType.PRIVATE) {
      const member = await this.channelService.isMember(channelId, userId);
      if (!member) {
        throw new ForbiddenException('You are not a member of this channel');
      }
    }

    return true;
  }
}
