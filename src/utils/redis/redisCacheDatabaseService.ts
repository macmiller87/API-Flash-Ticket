import { Redis as RedisClient } from 'ioredis';
import { Module } from '@nestjs/common';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async () => {

        try {
          return new RedisClient(String(process.env.REDIS_URL))
        }catch(error: unknown) {
          
          if(error instanceof Error) {
            throw new Error(error.message);
          }

        }
      },
    },
  ],
  exports: [REDIS_CLIENT],
})

export class RedisCacheDatabase {}