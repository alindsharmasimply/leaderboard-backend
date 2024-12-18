import Redis from 'ioredis';
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [{
    provide: 'REDIS',
    useFactory: () => new Redis(process.env.REDIS_URL),
  }, RedisService]
})

export class RedisModule { }
