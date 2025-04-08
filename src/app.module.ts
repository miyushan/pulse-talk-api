import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from './config/gqlConfig.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { RedisSubscriptionModule } from './redis-subscription/redis-subscription.module';
import { ConfigModule } from '@nestjs/config';
import { ChatroomModule } from './chatroom/chatroom.module';
import { LiveChatroomModule } from './live-chatroom/live-chatroom.module';
import { RedisClientModule } from './redis-client/redis-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    TokenModule,
    ChatroomModule,
    RedisSubscriptionModule,
    LiveChatroomModule,
    RedisClientModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [TokenModule, RedisSubscriptionModule],
      useClass: GqlConfigService,
    }),
  ],
})
export class AppModule {}
