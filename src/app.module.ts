import { CustomersController } from './modules/Customers/controller/customers.controller.js';
import { EventsController } from './modules/Events/controller/events.controller.js';
import { CustomersService } from './modules/Customers/service/customers.service.js';
import { UsersController } from './modules/Users/controller/users.Controller.js';
import { EventsService } from './modules/Events/service/events.service.js';
import { UsersService } from './modules/Users/service/users.service.js';
import { RabbitmqModule } from './utils/rabbitmq/rabbitmq.module.js';
import { DatabaseModule } from './prismaORM/database.module.js';
import { jwtAuthService } from './utils/jwt/jwtAuthService.js';
import { RedisModule } from './utils/redis/redis.module.js';
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
    RedisModule,
    RabbitmqModule
    
  ],
  controllers: [UsersController, EventsController, CustomersController],
  providers: [UsersService, EventsService, CustomersService, jwtAuthService]
})

export class AppModule {}
