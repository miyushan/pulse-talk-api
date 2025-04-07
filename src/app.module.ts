import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from './config/gqlConfig.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { RedisSubscriptionModule } from './redis-subscription/redis-subscription.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TokenModule,
    RedisSubscriptionModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [TokenModule, RedisSubscriptionModule],
      useClass: GqlConfigService,
    }),
  ],
})
export class AppModule {}
