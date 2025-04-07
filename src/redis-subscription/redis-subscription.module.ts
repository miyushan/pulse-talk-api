import { Module } from '@nestjs/common';
import { RedisSubscriptionService } from './redis-subscription.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [RedisSubscriptionService],
  exports: [RedisSubscriptionService],
})
export class RedisSubscriptionModule {}
