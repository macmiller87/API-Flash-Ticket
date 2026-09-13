import { Events, IEventsDTO } from "../entity/events.js";

export abstract class IEventsModel {
    abstract create(request: IEventsDTO, user_id: string): Promise<Events>;
}