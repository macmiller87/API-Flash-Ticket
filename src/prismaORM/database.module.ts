import { EventsModel } from "../modules/Events/model/eventsModel.js";
import { IEventsModel } from "../modules/Events/model/implementation-IEventsModel/iEventsModel.js";
import { IUsersModel } from "../modules/Users/model/implementation-IUsersModel/iUsersModel.js";
import { UsersModel } from "../modules/Users/model/usersModel.js";
import { PrismaService } from "./prisma/prismaService.js";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    PrismaService,

    {
      provide: IUsersModel,
      useClass: UsersModel,
    },
    {
      provide: IEventsModel,
      useClass: EventsModel,
    },


  ],

  exports: [IUsersModel, IEventsModel],
})

export class DatabaseModule {}