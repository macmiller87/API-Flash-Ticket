import { Body, Controller, Post, Query } from "@nestjs/common";
import { UsersService } from "../service/users.service.js";
import type { Users } from "../model/entity/users.js";

@Controller("api/users")
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() body: Users) {
        const { id, name, createdAt, admin} = await this.usersService.createUser(body);
        
        return {
            id,
            name,
            createdAt,
            admin
        }
    }

    @Post("createToken")
    async createToken(@Query("id") id: string, @Body() body: Users) {
        const resp = await this.usersService.loginUser(id, body);

        return {
            user: {
                id: resp.user.id,
                name: resp.user.name,
                createdAt: resp.user.createdAt,
                admin: resp.user.admin
            },
            token: resp.token
        }
    }

}