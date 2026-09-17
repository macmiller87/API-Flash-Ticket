import { IReserveEventStoredKeyDTO } from "../entity/reserveEventStoredKey.js";

export abstract class ICustomersModel {
    abstract createEventStoredReserve(reserveEventKey: string, expiresIn: number, quantity: string): Promise<string>;
    abstract updateEventStoredReserve(reserveEventKey: string, quantity: string): Promise<string>;
    abstract decreEventStoredKey(events_id: string): Promise<number>;
    abstract deleteEventStoredKey(events_id: string): Promise<void>;
    abstract deleteObjectEventStored(events_id: string): Promise<void>;
    abstract getReserveEventStoredKey(data: IReserveEventStoredKeyDTO): Promise<string | null>;
    abstract findEventById(events_id: string): Promise<string | null>;
}