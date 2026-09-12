import { EventsController } from './modules/Events/controller/events.controller.js';
import { UsersController } from './modules/Users/controller/users.Controller.js';
import { EventsService } from './modules/Events/service/events.service.js';
import { UsersService } from './modules/Users/service/users.service.js';;
import { DatabaseModule } from './prismaORM/database.module.js';
import { jwtAuthService } from './utils/jwt/jwtAuthService.js';
import { createObserveModule } from '@nestjs/observe';
import { KeyvCacheableMemory } from '@cacheable/memory';
import { CacheModule } from '@nestjs/cache-manager'
import { createKeyv, Keyv } from '@keyv/redis';
import { Module } from '@nestjs/common';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 })
            }),
            createKeyv(process.env.REDIS_URL)
          ]
        }
      }
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: String(process.env.APP_KEY),
      appSecret: String(process.env.APP_SECRET),
      serviceId: String(process.env.SERVICE_ID),
    }),
    DatabaseModule,
    
  ],
  controllers: [UsersController, EventsController],
  providers: [UsersService, EventsService, jwtAuthService]
})

export class AppModule {}
