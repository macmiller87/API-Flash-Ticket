import { IUsersDTO } from "../../modules/Users/model/entity/users.js";
import { AppError } from "../errors/appError.js";
import { SignOptions } from "jsonwebtoken";
import { Injectable } from "@nestjs/common";
import { compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

@Injectable()
export class jwtAuthService {

    async sign(user: IUsersDTO, password: string): Promise<string> {

        const checkPassword = await compare(password, user.password);

        if(checkPassword) {

            const payload = { 
                sub: user.id,
                name: user.name
            }

            const secret = String(process.env.SECRET);
            const expiresIn = process.env.EXPIRES_IN as SignOptions["expiresIn"];

            const accessToken = sign({ payload }, secret, {
                subject: user.id,
                expiresIn: expiresIn
            });

            return accessToken;
        }

        throw new AppError("Password Incorrect !", 401);
    }

    async verify(token: string): Promise<boolean | undefined> {

        try {
            const secret = String(process.env.SECRET);

            const checkToken = verify(token, secret);

            if(checkToken) {
                return true;
            }

            return false;

        }catch(error: unknown) {

            if(error instanceof Error) {
                throw new Error(error.message);
            }

        }

    }
   
}