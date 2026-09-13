import { EventsController } from './modules/Events/controller/events.controller.js';
import { UsersController } from './modules/Users/controller/users.Controller.js';
import { RedisCacheDatabase } from './utils/redis/redisCacheDatabaseService.js';
import { EventsService } from './modules/Events/service/events.service.js';
import { UsersService } from './modules/Users/service/users.service.js';;
import { DatabaseModule } from './prismaORM/database.module.js';
import { jwtAuthService } from './utils/jwt/jwtAuthService.js';
import { createObserveModule } from '@nestjs/observe';
import { Module } from '@nestjs/common';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: String(process.env.APP_KEY),
      appSecret: String(process.env.APP_SECRET),
      serviceId: String(process.env.SERVICE_ID),
    }),
    DatabaseModule,
    RedisCacheDatabase
    
  ],
  controllers: [UsersController, EventsController],
  providers: [UsersService, EventsService, jwtAuthService]
})

export class AppModule {}
