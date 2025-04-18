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
          password: this.configService.get('REDIS_PASSWORD'),
          retryStrategy: (times) => {
            if (times > 10) {
              return null;
            }
            return Math.min(times * 50, 2000);
          },
        },
      });
    } catch (error) {
      console.error('Error initializing Redis pub/sub:', error);
    }
  }

  async publish(channel: string, message: any) {
    return this.pubSub.publish(channel, message);
  }

  asyncIterator(channel: string) {
    return this.pubSub.asyncIterator(channel);
  }

  getPubSub() {
    return this.pubSub;
  }

  destroy() {
    this.pubSub.close();
  }
}
