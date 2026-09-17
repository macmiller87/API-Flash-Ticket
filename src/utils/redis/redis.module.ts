import { ICustomersModel } from '../../modules/Customers/model/implementation-ICustomersModel/iCustomersModel.js';
import { CustomersModel } from '../../modules/Customers/model/customersModel.js';
import { RedisCacheDatabaseService } from './redisCacheDatabaseService.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    RedisCacheDatabaseService,
    
    {
      provide: ICustomersModel,
      useClass: CustomersModel,
    },
    
  ],
  
  exports: [ICustomersModel, RedisCacheDatabaseService],
})

export class RedisModule {}