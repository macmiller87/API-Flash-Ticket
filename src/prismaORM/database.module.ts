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

  ],

  exports: [IUsersModel],
})

export class DatabaseModule {}