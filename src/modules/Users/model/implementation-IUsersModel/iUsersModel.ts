
import { IUsersDTO, Users } from "../entity/users.js";

export abstract class IUsersModel {
    abstract create(datas: IUsersDTO): Promise<Users>;
    abstract findUserByName(name: string): Promise<Users | null>;
}