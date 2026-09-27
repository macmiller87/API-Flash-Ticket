import { ICustomersModel } from '../../modules/Customers/model/implementation-ICustomersModel/iCustomersModel.js';
import { RedisCacheDatabaseService } from '../redis/redisCacheDatabaseService.js';  
import { CustomersModel } from '../../modules/Customers/model/customersModel.js';
import { PrismaService } from '../../prismaORM/prisma/prismaService.js';
import { RabbitmqService } from './service/rabbitmqService.js';
import { rabbitmqConfig } from './config/rabbitmqConfig.js';
import { ClientsModule } from '@nestjs/microservices';
import { Module } from "@nestjs/common";

@Module({
  imports: [
      ClientsModule.register([
      {
        name: 'TICKET_SERVICE',
        ...rabbitmqConfig,
      },
    ]),
  ],

  controllers: [RabbitmqService],
  providers: [
    RabbitmqService, 
    PrismaService,
    RedisCacheDatabaseService,

    {
      provide: ICustomersModel,
      useClass: CustomersModel,
    },

  ],
  exports: [RabbitmqService, ICustomersModel]
})

export class RabbitmqModule {}
