import { RedisCacheDatabaseService } from "../../../utils/redis/redisCacheDatabaseService.js";
import { IReserveEventStoredKeyDTO } from "./entity/reserveEventStoredKey.js";
import { ICustomersModel } from "./implementation-ICustomersModel/iCustomersModel.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomersModel implements ICustomersModel {
   
    constructor(private readonly redisCacheDatabaseService: RedisCacheDatabaseService) {}

    async createEventStoredReserve(reserveEventKey: string, expiresIn: number, quantity: string): Promise<string> {
        const create = await this.redisCacheDatabaseService.setex(reserveEventKey, expiresIn, quantity);
        return create;
    }

    async updateEventStoredReserve(reserveEventKey: string, quantity: string): Promise<string> {
        const update = await this.redisCacheDatabaseService.call("SET", [reserveEventKey, quantity, 'KEEPTTL']);
        return update as string;
    }

    async decreEventStoredKey(events_id: string): Promise<number> {
        const curentEventStock = await this.redisCacheDatabaseService.decr(events_id);
        return curentEventStock;
    }

    async deleteEventStoredKey(events_id: string): Promise<void> {
        await this.redisCacheDatabaseService.del(events_id);
    }

    async deleteObjectEventStored(events_id: string): Promise<void> {
        await this.redisCacheDatabaseService.del(events_id);
    }

    async getReserveEventStoredKey(data: IReserveEventStoredKeyDTO): Promise<string | null> {

        const reserveEventStoredKey = {
            user: data.user,
            event: data.event,
            name: data.name,
            date: data.date,
            sector: data.sector
        }

        const find = this.redisCacheDatabaseService.get(JSON.stringify(reserveEventStoredKey));
        return find;
    }

    async findEventById(events_id: string): Promise<string | null> {
        const find = await this.redisCacheDatabaseService.get(events_id);
        return find;
    }

}