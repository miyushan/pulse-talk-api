import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { ChatroomService } from './chatroom.service';
import { UserService } from 'src/user/user.service';
import { UseGuards } from '@nestjs/common';
import { ChatRoom, Message } from './types/types';
import { PubSub } from 'graphql-subscriptions';
import { User } from 'src/user/types';
import { RequestWithUser } from 'src/types';
import { AccessTokenGuard } from 'src/auth/guards';

@Resolver()
export class ChatroomResolver {
  public pubSub: PubSub;
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly userService: UserService,
  ) {
    this.pubSub = new PubSub();
  }

  @UseGuards(AccessTokenGuard)
  @Mutation((returns) => User)
  async userStartedTypingMutation(
    @Args('chatRoomId') chatRoomId: number,
    @Context() context: { req: RequestWithUser },
  ) {
    if (!context.req.user) throw new Error('User not found');
    const user = await this.userService.getUserById(context.req.user.sub);
    await this.pubSub.publish(`userStartedTyping.${chatRoomId}`, {
      user,
      typingUserId: user?.id,
    });
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => User, {})
  async userStoppedTypingMutation(
    @Args('chatRoomId') chatRoomId: number,
    @Context() context: { req: RequestWithUser },
  ) {
    if (!context.req.user) throw new Error('User not found');
    const user = await this.userService.getUserById(context.req.user.sub);

    await this.pubSub.publish(`userStoppedTyping.${chatRoomId}`, {
      user,
      typingUserId: user?.id,
    });

    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Message)
  async sendMessage(
    @Args('chatRoomId') chatRoomId: number,
    @Args('content') content: string,
    @Context() context: { req: RequestWithUser },
  ) {
    if (!context.req.user) throw new Error('User not found');

    const newMessage = await this.chatroomService.sendMessage(
      chatRoomId,
      content,
      context.req.user.sub,
    );
    await this.pubSub
      .publish(`newMessage.${chatRoomId}`, { newMessage })
      .then((res) => {
        console.log('published', res);
      })
      .catch((err) => {
        console.log('err', err);
      });

    return newMessage;
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => ChatRoom)
  async createChatroom(
    @Args('name') name: string,
    @Context() context: { req: RequestWithUser },
  ) {
    if (!context.req.user) throw new Error('User not found');
    return this.chatroomService.createChatroom(name, context.req.user.sub);
  }

  @Mutation(() => ChatRoom)
  async addUsersToChatroom(
    @Args('chatRoomId') chatRoomId: number,
    @Args('userIds', { type: () => [Number] }) userIds: number[],
  ) {
    return this.chatroomService.addUsersToChatroom(chatRoomId, userIds);
  }

  @Query(() => [ChatRoom])
  async getChatRoomsForUser(@Args('userId') userId: number) {
    return this.chatroomService.getChatRoomsForUser(userId);
  }

  @Query(() => [Message])
  async getMessagesForChatroom(@Args('chatRoomId') chatRoomId: number) {
    return this.chatroomService.getMessagesForChatroom(chatRoomId);
  }

  @Mutation(() => String)
  async deleteChatroom(@Args('chatRoomId') chatRoomId: number) {
    await this.chatroomService.deleteChatroom(chatRoomId);
    return 'Chatroom deleted successfully';
  }
}
