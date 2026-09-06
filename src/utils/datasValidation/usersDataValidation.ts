import { AppError } from "../errors/appError.js";

export async function usersDataValidation(name: string, password: string) {

    if(name === "" || password === "") {
        throw new AppError("All fields must be filled in.", 401);
    }

    if(typeof(name) != "string" || typeof(password) != "string") {
        throw new AppError("All datas must be 'strings'.", 401);
    }

    return true;
}