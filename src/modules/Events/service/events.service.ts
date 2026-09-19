import { eventsDataValidation } from "../../../utils/datasValidation/eventsDataValidation.js";
import { RedisCacheDatabaseService } from "../../../utils/redis/redisCacheDatabaseService.js";
import { IUsersModel } from "../../Users/model/implementation-IUsersModel/iUsersModel.js";
import { IEventsModel } from "../model/implementation-IEventsModel/iEventsModel.js";
import { Events, IEventsDTO } from "../model/entity/events.js";
import { AppError } from "../../../utils/errors/appError.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventsService {

    constructor(
        private readonly redisCacheDatabaseService: RedisCacheDatabaseService,
        private readonly eventsModel: IEventsModel,
        private readonly usersModel: IUsersModel,
    ) {}

    async create(request: IEventsDTO, user_id: string): Promise<Events> {

        const checkEventsData = await eventsDataValidation(request);

        if(checkEventsData === true) {
            const findUserById = await this.usersModel.findUserById(user_id);

            if(!findUserById) {
                throw new AppError("User Not Found !", 404);
            }

        }

        const create = await this.eventsModel.create(request, user_id);
        await this.redisCacheDatabaseService.set(create.id, JSON.stringify(create));

        const redisKeyEvent = `Event:${create.id}`;

        const eventStoredKey = {
            event: create.id,
            name: create.name,
            date: create.date,
            sector: create.availableSectors,
            quantity: create.quantity
        }

        await this.redisCacheDatabaseService.hset(redisKeyEvent, eventStoredKey);

        return create;
    }

    async getEvent(event_id: string): Promise<Events> {

        const findEventByKeyOnRedis = await this.redisCacheDatabaseService.get(event_id);

        if(findEventByKeyOnRedis === null) {
            throw new AppError("Event Not Found !", 404);
        }

        return JSON.parse(findEventByKeyOnRedis) as Events;
    }    

}