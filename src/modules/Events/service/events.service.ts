import { eventsDataValidation } from "../../../utils/datasValidation/eventsDataValidation.js";
import { IUsersModel } from "../../Users/model/implementation-IUsersModel/iUsersModel.js";
import { IEventsModel } from "../model/implementation-IEventsModel/iEventsModel.js";
import { Events, IEventsDTO } from "../model/entity/events.js";
import { AppError } from "../../../utils/errors/appError.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventsService {

    constructor(
        private readonly eventsModel: IEventsModel,
        private readonly usersModel: IUsersModel,
    ) {}

    async create(request: IEventsDTO, user_id: string): Promise<Events | void> {

        const checkEventsData = await eventsDataValidation(request);

        if(checkEventsData === true) {
            const checkEventsByName = await this.eventsModel.findEventsByName(request.name);
            const findUserById = await this.usersModel.findUserById(user_id);

            if(checkEventsByName) {
                throw new AppError("Event 'Name' already exist !", 401);
            }

            if(!findUserById) {
                throw new AppError("User Not Found !", 404);
            }

            const create = await this.eventsModel.create(request, user_id);
            return create;
        }
        
    }

}