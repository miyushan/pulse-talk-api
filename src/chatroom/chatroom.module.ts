import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomResolver } from './chatroom.resolver';
import { PrismaService } from 'src/config/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RedisSubscriptionService } from 'src/redis-subscription/redis-subscription.service';

@Module({
  providers: [
    ChatroomService,
    ChatroomResolver,
    PrismaService,
    UserService,
    JwtService,
    RedisSubscriptionService,
  ],
})
export class ChatroomModule {}
