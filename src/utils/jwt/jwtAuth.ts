import { AppError } from "../errors/appError.js";
import { SignOptions } from "jsonwebtoken";
import { compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;

export async function unhashPassword(user: { id: string; name: string; password: string }, password: string) {

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