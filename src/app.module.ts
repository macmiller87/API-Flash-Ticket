import { UsersController } from './modules/Users/controller/users.Controller.js';
import { UsersService } from './modules/Users/service/users.service.js';
import { DatabaseModule } from './prismaORM/database.module.js';
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
    
  ],
  controllers: [UsersController],
  providers: [
    UsersService
  ]
})

export class AppModule {}
