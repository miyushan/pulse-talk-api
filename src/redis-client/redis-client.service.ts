import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisClientService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisClientService.name);

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST') || 'localhost',
      port: parseInt(this.configService.get('REDIS_PORT') || '6379', 10),
      password: this.configService.get('REDIS_PASSWORD'),
      tls: this.configService.get('REDIS_TLS') === 'true' ? {} : undefined,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on('error', (err) =>
      this.logger.error('Redis Client Error:', err),
    );
  }

  async smembers(key: string): Promise<string[]> {
    try {
      return await this.client.smembers(key);
    } catch (err) {
      this.logger.error(`smembers failed for key ${key}`, err);
      throw err;
    }
  }

  async sAdd(key: string, ...values: string[]): Promise<number> {
    try {
      return await this.client.sadd(key, ...values);
    } catch (err) {
      this.logger.error(`sAdd failed for key ${key}`, err);
      throw err;
    }
  }

  async sRem(key: string, ...values: string[]): Promise<number> {
    try {
      return await this.client.srem(key, ...values);
    } catch (err) {
      this.logger.error(`sRem failed for key ${key}`, err);
      throw err;
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch (err) {
      this.logger.error('Failed to quit Redis client', err);
    }
  }
}
