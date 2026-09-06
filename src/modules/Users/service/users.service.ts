import { usersDataValidation } from "../../../utils/datasValidation/usersDataValidation.js";
import { IUsersModel } from "../model/implementation-IUsersModel/iUsersModel.js";
import { AppError } from "../../../utils/errors/appError.js";
import { IUsersDTO, Users } from "../model/entity/users.js";
import { Injectable } from "@nestjs/common";
import { hash } from "bcrypt";

@Injectable()
export class UsersService {

    constructor(private usersModel: IUsersModel) {}

    async create(request: IUsersDTO): Promise<Users> {
        const { name, password} = request;

        const checkUsersData = await usersDataValidation(name, password);
    
        if(checkUsersData == true) {
            const checkUsersByName = await this.usersModel.findUserByName(name);

            if(!checkUsersByName) {
                const passwordSalt = Number(process.env.PASSWORD_SALT);
                const passwordHash = await hash(password, passwordSalt);

                const create = await this.usersModel.create({
                    name: name,
                    password: passwordHash
                });

                return create;
            }

        }
        
        throw new AppError("User already exist !", 404);
    }
    
}