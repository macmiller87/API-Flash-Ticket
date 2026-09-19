import { RedisCacheDatabaseService } from "../../../utils/redis/redisCacheDatabaseService.js";
import { ICustomersModel } from "./implementation-ICustomersModel/iCustomersModel.js";
import { IReserveEventStoredKeyDTO } from "./entity/reserveEventStoredKey.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomersModel implements ICustomersModel {
   
    constructor(private readonly redisCacheDatabaseService: RedisCacheDatabaseService) {}

    async createEventStoredReserve(redisKeyReserve: string, data: IReserveEventStoredKeyDTO, expiresIn: number): Promise<string> {
        const create = await this.redisCacheDatabaseService.set(redisKeyReserve, JSON.stringify(data), 'EX', expiresIn);
        return create;
    }

    async updateEventStoredReserve(redisKeyReserve: string, quantity: number): Promise<string| null> {
        const find = await this.redisCacheDatabaseService.get(redisKeyReserve);

        if(find) {
            const obj = JSON.parse(find);
            obj.quantity = quantity;
            await this.redisCacheDatabaseService.set(redisKeyReserve, JSON.stringify(obj), 'KEEPTTL');
        }

        return find;
    }

    async decreEventStoredKey(redisKeyEvent: string): Promise<number> {
        const curentEventStock = await this.redisCacheDatabaseService.hincrby(redisKeyEvent, "quantity", -1);
        return curentEventStock;
    }

    async deleteEventStoredKey(redisKeyEvent: string): Promise<void> {
        await this.redisCacheDatabaseService.del(redisKeyEvent);
    }

    async deleteReserveEventStoredKey(events_id: string): Promise<void> {
        await this.redisCacheDatabaseService.del(events_id);
    }

    async deleteObjectEventStored(events_id: string): Promise<void> {
        await this.redisCacheDatabaseService.del(events_id);
    }

    async deleteEventReserve(redisKeyReserve: string): Promise<void> {
        await this.redisCacheDatabaseService.del(redisKeyReserve);
    }

    async getReserveEventStoredKey(user_id: string, event_id: string): Promise<string | null> {
        const redisKeyReserve = `Reserve:${event_id}:User:${user_id}`;

        const find = this.redisCacheDatabaseService.get(redisKeyReserve);
        return find;
    }

    async findEventById(events_id: string): Promise<string | null> {
        const find = await this.redisCacheDatabaseService.get(events_id);
        return find;
    }

}