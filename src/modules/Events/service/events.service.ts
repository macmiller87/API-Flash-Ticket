import { eventsDataValidation } from "../../../utils/datasValidation/eventsDataValidation.js";
import { IUsersModel } from "../../Users/model/implementation-IUsersModel/iUsersModel.js";
import { IEventsModel } from "../model/implementation-IEventsModel/iEventsModel.js";
import { REDIS_CLIENT } from "../../../utils/redis/redisCacheDatabaseService.js";
import { Events, IEventsDTO } from "../model/entity/events.js";
import { AppError } from "../../../utils/errors/appError.js";
import { Inject, Injectable } from "@nestjs/common";
import { Redis as RedisClient } from "ioredis";

@Injectable()
export class EventsService {

    constructor(
        private readonly eventsModel: IEventsModel,
        private readonly usersModel: IUsersModel,
        @Inject(REDIS_CLIENT) private readonly redisCacheDatabaseService: RedisClient,
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