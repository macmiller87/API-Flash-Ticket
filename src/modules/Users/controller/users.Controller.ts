import { UsersService } from "../service/users.service.js";
import type { Users } from "../model/entity/users.js";
import { Body, Controller, Post } from "@nestjs/common";

@Controller("api/users")
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() body: Users) {
        const { id, name, createdAt, admin} = await this.usersService.create(body);
        
        return {
            id,
            name,
            createdAt,
            admin
        }
    }

}