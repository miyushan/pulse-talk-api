import { Test, TestingModule } from '@nestjs/testing';
import { RedisSubscriptionService } from './redis-subscription.service';

describe('RedisSubscriptionService', () => {
  let service: RedisSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisSubscriptionService],
    }).compile();

    service = module.get<RedisSubscriptionService>(RedisSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
