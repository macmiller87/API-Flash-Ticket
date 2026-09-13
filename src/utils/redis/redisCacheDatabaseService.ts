import { Redis as RedisClient } from "ioredis";
import { Module } from '@nestjs/common';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;
        return new RedisClient(String(redisUrl));
      },
    },
  ],
  exports: [REDIS_CLIENT],
})

export class RedisCacheDatabase {}