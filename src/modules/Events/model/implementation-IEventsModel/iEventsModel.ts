import { Events, IEventsDTO } from "../entity/events.js";

export abstract class IEventsModel {
    abstract create(request: IEventsDTO, user_id: string): Promise<Events>;
    abstract updateEventQuantityById(event_id: string): Promise<Events | null>;
    abstract delete(event_id: string): Promise<void>;
}