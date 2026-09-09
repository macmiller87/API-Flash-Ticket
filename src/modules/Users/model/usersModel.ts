import { IUsersModel } from "./implementation-IUsersModel/iUsersModel.js";
import { PrismaService } from "../../../prismaORM/prisma/prismaService.js";
import { IUsersDTO, Users } from "./entity/users.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersModel implements IUsersModel {

    constructor(private readonly prismaService: PrismaService) {}

    async create(datas: IUsersDTO): Promise<Users> {
        const createUser = await this.prismaService.users.create({
            data: datas,
            include: {
                events: true
            }
        });

        return createUser;
    }

    async setUserASAdmin(id: string): Promise<Users> {
        const updateUserAdmin = await this.prismaService.users.update({
            where: {
                id: id
            },
            data: {
                admin: "ADMIN"
            }
        });

        return updateUserAdmin;
    }

    async findUserById(id: string): Promise<Users | null> {
        const find = await this.prismaService.users.findFirst({
            where: {
                id: id
            }
        });

        return find;
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
