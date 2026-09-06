import { IUsersModel } from "./implementation-IUsersModel/iUsersModel.js";
import { PrismaService } from "../../../prismaORM/prisma/prismaService.js";
import { IUsersDTO, Users } from "./entity/users.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersModel implements IUsersModel {

    constructor(private readonly prismaService: PrismaService) {}

    async create(datas: IUsersDTO): Promise<Users> {
        const createUser = await this.prismaService.users.create({
            data: datas
        });

        return {
            id: createUser.id,
            name: createUser.name,
            password: createUser.password,
            createdAt: createUser.createdAt,
            admin: createUser.admin,
        };
    }

    async findUserByName(name: string): Promise<Users | null> {
        const find = await this.prismaService.users.findUnique({
            where: {
                name: name
            }
        });

        return find;
    }
    
}
