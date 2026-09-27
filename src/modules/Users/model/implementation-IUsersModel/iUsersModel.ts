import { IUsersDTO, Users } from "../entity/users.js";

export abstract class IUsersModel {
    abstract create(datas: IUsersDTO): Promise<Users>;
    abstract findUserByName(name: string): Promise<Users | null>;
    abstract findUserById(id: string): Promise<Users | null>;
    abstract setUserASAdmin(id: string): Promise<Users>;
    abstract updateUserBalance(user_id: string, balance: number): Promise<Users | null>;
}