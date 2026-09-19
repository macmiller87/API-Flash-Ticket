import { IReserveEventStoredKeyDTO } from "../entity/reserveEventStoredKey.js";

export abstract class ICustomersModel {
    abstract createEventStoredReserve(redisKeyReserve: string, data: IReserveEventStoredKeyDTO, expiresIn: number): Promise<string>;
    abstract updateEventStoredReserve(redisKeyReserve: string, quantity: number): Promise<string | null>;
    abstract decreEventStoredKey(redisKeyEvent: string): Promise<number>;
    abstract deleteEventStoredKey(redisKeyEvent: string): Promise<void>;
    abstract deleteReserveEventStoredKey(events_id: string): Promise<void>;
    abstract deleteObjectEventStored(events_id: string): Promise<void>;
    abstract deleteEventReserve(redisKeyReserve: string): Promise<void>;
    abstract getReserveEventStoredKey(user_id: string, event_id: string): Promise<string | null>;
    abstract findEventById(events_id: string): Promise<string | null>;
}