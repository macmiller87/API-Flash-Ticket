import { eventsDataValidation } from "../../../utils/datasValidation/eventsDataValidation.js";
import { IUsersModel } from "../../Users/model/implementation-IUsersModel/iUsersModel.js";
import { IEventsModel } from "../model/implementation-IEventsModel/iEventsModel.js";
import { Events, IEventsDTO } from "../model/entity/events.js";
import { AppError } from "../../../utils/errors/appError.js";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class EventsService {

    constructor(
        private readonly eventsModel: IEventsModel,
        private readonly usersModel: IUsersModel,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
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
        await this.cacheManager.set(create.id, create);
        return create;
    }

    async getEvent(event_id: string): Promise<Events> {

        const findEventByKeyOnRedis = await this.cacheManager.get(event_id);

        if(!findEventByKeyOnRedis && findEventByKeyOnRedis === undefined) {
            const findEventById = await this.eventsModel.findEventsById(event_id);   

            if(!findEventById) {
                throw new AppError("Event Not Found !", 404);
            }

            return findEventById;
        }

        return findEventByKeyOnRedis as Events;
    }    

}