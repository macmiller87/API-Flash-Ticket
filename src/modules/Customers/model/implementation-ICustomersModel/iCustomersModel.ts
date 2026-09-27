import { IReserveEventStoredKeyDTO } from "../entity/reserveEventStoredKey.js";

export abstract class ICustomersModel {
    abstract createEventStoredReserve(redisKeyReserve: string, data: IReserveEventStoredKeyDTO, expiresIn: number): Promise<number>;
    abstract reserveStatusKey(redisKeyReserve: string, status: string, expiresIn: number): Promise<string>;
    abstract updateReserveStatusKey(statusKey: string, status: string): Promise<string>;
    abstract updateEventStoredReserve(redisKeyReserve: string, quantity: number): Promise<object>;
    abstract decreEventStoredKey(redisKeyEvent: string): Promise<number>;
    abstract decreReserveStoredKey(redisKeyEvent: string): Promise<number>;
    abstract increEventStoredKey(redisKeyEvent: string): Promise<number>;
    abstract deleteEventStoredKey(redisKeyEvent: string): Promise<void>;
    abstract deleteReserveEventStoredKey(events_id: string): Promise<void>;
    abstract deleteObjectEventStored(events_id: string): Promise<void>;
    abstract deleteEventReserve(redisKeyReserve: string): Promise<void>;
    abstract getReserveEventStoredKey(user_id: string, event_id: string): Promise<string | null>;
    abstract getReserveStatusKey(statusKey: string): Promise<string | null>;
    abstract findEventById(redisKeyEvent: string): Promise<object>;
    abstract findReserveById(redisKeyReserve: string): Promise<object>;
}