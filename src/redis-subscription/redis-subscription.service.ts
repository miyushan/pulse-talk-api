import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class RedisSubscriptionService {
  private pubSub: RedisPubSub;

  constructor(private readonly configService: ConfigService) {
    try {
      this.pubSub = new RedisPubSub({
        connection: {
          host: this.configService.get('REDIS_HOST'),
          port: this.configService.get('REDIS_PORT'),
        },
      });
    } catch (error) {
      console.error('Error initializing Redis pub/sub:', error);
    }
  }

  getPubSub() {
    return this.pubSub;
  }

  destroy() {
    this.pubSub.close();
  }
}
