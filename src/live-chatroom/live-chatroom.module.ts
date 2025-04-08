import { Module } from '@nestjs/common';
import { LiveChatroomResolver } from './live-chatroom.resolver';
import { LiveChatroomService } from './live-chatroom.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/config/prisma.service';
import { RedisClientService } from 'src/redis-client/redis-client.service';

@Module({
  providers: [
    LiveChatroomResolver,
    LiveChatroomService,
    UserService,
    PrismaService,
    JwtService,
    RedisClientService,
  ],
})
export class LiveChatroomModule {}
