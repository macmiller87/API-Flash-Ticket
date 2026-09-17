import { Redis as RedisClient } from 'ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisCacheDatabaseService extends RedisClient {

  constructor() {
    super(String(process.env.REDIS_URL));

    this.on('error', (error) => {
      throw new Error(error.message);
    });

  }

}