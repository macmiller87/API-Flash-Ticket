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
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'api-flash-ticket',
    }),
    DatabaseModule,
    
  ],
  controllers: [UsersController],
  providers: [
    UsersService
  ]
})

export class AppModule {}
