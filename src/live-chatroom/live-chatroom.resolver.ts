import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { LiveChatroomService } from './live-chatroom.service';
import { UserService } from 'src/user/user.service';
import { Subscription, Args, Context, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards';
import { RequestWithUser } from 'src/types';
import { User } from 'src/user/types';

@Resolver()
export class LiveChatroomResolver {
  private pubSub: PubSub;
  constructor(
    private readonly liveChatroomService: LiveChatroomService,
    private readonly userService: UserService,
  ) {
    this.pubSub = new PubSub();
  }

  @Subscription(() => [User], {
    nullable: true,
    resolve: (value) => value.liveUsers,
    filter: (payload, variables) => {
      return payload.chatRoomId === variables.chatRoomId;
    },
  })
  liveUsersInChatroom(@Args('chatRoomId') chatRoomId: number) {
    return this.pubSub.asyncIterableIterator(
      `liveUsersInChatroom.${chatRoomId}`,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Boolean)
  async enterChatroom(
    @Args('chatRoomId') chatRoomId: number,
    @Context() context: { req: RequestWithUser },
  ) {
    if (!context.req.user) throw new Error('User not found');
    const user = await this.userService.getUserById(context.req.user.sub);

    if (!user) throw new Error('User not found');

    await this.liveChatroomService.addLiveUserToChatroom(chatRoomId, user);
    const liveUsers = await this.liveChatroomService
      .getLiveUsersForChatroom(chatRoomId)
      .catch((err) => {
        console.log('getLiveUsersForChatroom error', err);
      });

    await this.pubSub
      .publish(`liveUsersInChatroom.${chatRoomId}`, {
        liveUsers,
        chatRoomId,
      })
      .catch((err) => {
        console.log('pubSub error', err);
      });
    return true;
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Boolean)
  async leaveChatroom(
    @Args('chatRoomId') chatRoomId: number,
    @Context() context: { req: RequestWithUser },
  ) {
    if (!context.req.user) throw new Error('User not found');

    const user = await this.userService.getUserById(context.req.user.sub);

    if (!user) throw new Error('User not found');

    await this.liveChatroomService.removeLiveUserFromChatroom(chatRoomId, user);
    const liveUsers =
      await this.liveChatroomService.getLiveUsersForChatroom(chatRoomId);
    await this.pubSub.publish(`liveUsersInChatroom.${chatRoomId}`, {
      liveUsers,
      chatRoomId,
    });

    return true;
  }
}
