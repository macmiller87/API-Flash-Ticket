import { PrismaService } from "../../../prismaORM/prisma/prismaService.js";
import { UserAdmin } from "../../../prismaORM/generated/prisma/enums.js";
import { IUsersModel } from "./implementation-IUsersModel/iUsersModel.js";
import { IUsersDTO, Users } from "./entity/users.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersModel implements IUsersModel {

    constructor(private readonly prismaService: PrismaService) {}

    async create(datas: IUsersDTO): Promise<Users> {
        
        const createUser = await this.prismaService.users.create({
            data: {
                name: datas.name,
                password: datas.password,
                wallet: {
                    create: {
                        user_id: datas.id,
                        balance: datas.wallet?.balance
                    }
                }
            },
            include: {
                events: true,
                wallet: true
            }
        });

        return new Users({
            id: createUser.id,
            name: createUser.name,
            password: createUser.password,
            createdAt: createUser.createdAt,
            admin: createUser.admin,
            wallet: {
                user_id: createUser.id,
                balance: Number(createUser.wallet?.balance)
            }
        });
    }

    async setUserASAdmin(id: string): Promise<Users> {
        const find = await this.prismaService.users.findFirst({
            where: {
                id: id
            }
        });

        if(find?.admin === UserAdmin.ADMIN) {
            const updateUserAdmin = await this.prismaService.users.update({
                where: {
                    id: id
                },
                data: {
                    admin: UserAdmin.ADMIN
                },
                include: {
                    events: true,
                    wallet: false
                }
            });

            return new Users({
                id: updateUserAdmin.id,
                name: updateUserAdmin.name,
                password: updateUserAdmin.password,
                createdAt: updateUserAdmin.createdAt,
                admin: updateUserAdmin.admin
            });

        }

        const updateUserAdmin = await this.prismaService.users.update({
            where: {
                id: id
            },
            data: {
                admin: UserAdmin.ADMIN,
                wallet: {
                    delete: {
                        user_id: id
                    }
                }
            },
            include: {
                events: true,
                wallet: false
            }
        });

        return new Users({
            id: updateUserAdmin.id,
            name: updateUserAdmin.name,
            password: updateUserAdmin.password,
            createdAt: updateUserAdmin.createdAt,
            admin: updateUserAdmin.admin
        });

    }

    async findUserById(id: string): Promise<Users | null> {
        const find = await this.prismaService.users.findFirst({
            where: {
                id: id
            },
            include: {
                wallet: true
            }
        });

        if(find) {

            return new Users({
                id: find.id,
                name: find.name,
                password: find.password,
                createdAt: find.createdAt,
                admin: find.admin,
                wallet: {
                    user_id: find.id,
                    balance: Number(find.wallet?.balance)
                }
            });

        };

        return find;
    }

    async findUserByName(name: string): Promise<Users | null> {
        const find = await this.prismaService.users.findUnique({
            where: {
                name: name
            },
            include: {
                wallet: true
            }
        });

        if(find) {

            return new Users({
                id: find.id,
                name: find.name,
                password: find.password,
                createdAt: find.createdAt,
                admin: find.admin,
                wallet: {
                    user_id: find.id,
                    balance: Number(find.wallet?.balance)
                }
            });

        };

        return find;
    }
    
}
