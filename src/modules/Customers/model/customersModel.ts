import { RedisCacheDatabaseService } from "../../../utils/redis/redisCacheDatabaseService.js";
import { ICustomersModel } from "./implementation-ICustomersModel/iCustomersModel.js";
import { IReserveEventStoredKeyDTO } from "./entity/reserveEventStoredKey.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomersModel implements ICustomersModel {
   
    constructor(private readonly redisCacheDatabaseService: RedisCacheDatabaseService) {}

    async createEventStoredReserve(redisKeyReserve: string, data: IReserveEventStoredKeyDTO, expiresIn: number): Promise<number> {
        const create = await this.redisCacheDatabaseService.hset(redisKeyReserve, data);
        await this.redisCacheDatabaseService.expire(redisKeyReserve, expiresIn);
        return create;
    }

    async reserveStatusKey(redisKeyReserve: string, status: string, expiresIn: number): Promise<string> {
        const create = await this.redisCacheDatabaseService.set(redisKeyReserve, status, 'EX', expiresIn);
        return create;
    }

    async updateReserveStatusKey(statusKey: string, status: string): Promise<string> {
        const update = await this.redisCacheDatabaseService.set(statusKey, status, "KEEPTTL");
        return update;
    }

    async updateEventStoredReserve(redisKeyReserve: string, quantity: number): Promise<object> {
        const find = await this.redisCacheDatabaseService.hgetall(redisKeyReserve);

        if(find && Object.keys(find).length > 0) {            
            const obj = JSON.parse(JSON.stringify(find));
            obj.quantity = quantity;
            await this.redisCacheDatabaseService.hset(redisKeyReserve, obj);

            const currentTtl = await this.redisCacheDatabaseService.ttl(redisKeyReserve);

            if(currentTtl > 0) {
                await this.redisCacheDatabaseService.expire(redisKeyReserve, currentTtl);
            }

        }

        return find;
    }

    async decreEventStoredKey(redisKeyEvent: string): Promise<number> {
        const curentEventStock = await this.redisCacheDatabaseService.hincrby(redisKeyEvent, "quantity", -1);
        return curentEventStock;
    }

    async decreReserveStoredKey(redisKeyEvent: string): Promise<number> {
        const curentReserveStock = await this.redisCacheDatabaseService.hincrby(redisKeyEvent, "quantity", -1);
        return curentReserveStock;
    }

    async increEventStoredKey(redisKeyEvent: string): Promise<number> {
        const curentEventStock = await this.redisCacheDatabaseService.hincrby(redisKeyEvent, "quantity", +1);
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

        const find = await this.redisCacheDatabaseService.get(redisKeyReserve);
        return find;
    }

    async getReserveStatusKey(statusKey: string): Promise<string | null> {
       const find = await this.redisCacheDatabaseService.get(statusKey);
       return find;
    }

    async findEventById(redisKeyEvent: string): Promise<object> {
        const find = await this.redisCacheDatabaseService.hgetall(redisKeyEvent);
        return find;
    }

    async findReserveById(redisKeyReserve: string): Promise<object> {
        const find = await this.redisCacheDatabaseService.hgetall(redisKeyReserve);
        return find;
    }

}