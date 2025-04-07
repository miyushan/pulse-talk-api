import { Module } from '@nestjs/common';
import { RedisSubscriptionService } from './redis-subscription.service';

@Module({
  providers: [RedisSubscriptionService],
  exports: [RedisSubscriptionService],
})
export class RedisSubscriptionModule {}
