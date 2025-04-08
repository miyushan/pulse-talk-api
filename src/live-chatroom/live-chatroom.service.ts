import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClientService } from 'src/redis-client/redis-client.service';
import { User } from 'src/user/types';

@Injectable()
export class LiveChatroomService {
  constructor(private readonly redisClientService: RedisClientService) {}

  async addLiveUserToChatroom(chatRoomId: number, user: User): Promise<void> {
    const existingLiveUsers = await this.getLiveUsersForChatroom(chatRoomId);

    const existingUser = existingLiveUsers.find(
      (liveUser) => liveUser.id === user.id,
    );
    if (existingUser) {
      return;
    }
    await this.redisClientService.sAdd(
      `liveUsers:chatRoom:${chatRoomId}`,
      JSON.stringify(user),
    );
  }

  async removeLiveUserFromChatroom(
    chatRoomId: number,
    user: User,
  ): Promise<void> {
    await this.redisClientService
      .sRem(`liveUsers:chatRoom:${chatRoomId}`, JSON.stringify(user))
      .catch((err) => {
        console.log('removeLiveUserFromChatroom error', err);
      })
      .then((res) => {
        console.log('removeLiveUserFromChatroom res', res);
      });
  }

  async getLiveUsersForChatroom(chatRoomId: number): Promise<User[]> {
    const users = await this.redisClientService.smembers(
      `liveUsers:chatRoom:${chatRoomId}`,
    );

    return users.map((user) => JSON.parse(user));
  }
}
