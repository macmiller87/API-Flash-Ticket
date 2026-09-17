import { IEventsModel } from "../../Events/model/implementation-IEventsModel/iEventsModel.js";
import { ICustomersModel } from "../model/implementation-ICustomersModel/iCustomersModel.js";
import { IUsersModel } from "../../Users/model/implementation-IUsersModel/iUsersModel.js";
import { AppError } from "../../../utils/errors/appError.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomersService {

    constructor(
        private readonly usersService: IUsersModel,
        private readonly eventsService: IEventsModel,
        private readonly customersModel: ICustomersModel
    ) {}

    async createEventsReserve(user_id: string, event_id: string, ): Promise<object> {
        const findUserById = await this.usersService.findUserById(user_id);
        const findEventById = await this.customersModel.findEventById(event_id);

        if(!findUserById) {
            throw new AppError("User Not Found !", 404);
        }

        
        if(findEventById === null) {
            throw new AppError("Event Not Found !", 404);
        }

        const data = JSON.parse(findEventById);
        const name = data.name;
        const date = data.date;
        const availableSectors = data.availableSectors;

        const eventStoredKey = {
            event: event_id,
            name: name,
            date: date,
            sector: availableSectors
        }

        const reserveEventStoredKey = {
            user: user_id,
            event: event_id,
            name: name,
            date: date,
            sector: availableSectors
        }

        const curentEventStoredKey = await this.customersModel.decreEventStoredKey(JSON.stringify(eventStoredKey));

        if(curentEventStoredKey >= 0) {
            await this.eventsService.updateEventQuantityById(event_id);

            const checkReserveEventStoredKey = await this.customersModel.getReserveEventStoredKey(reserveEventStoredKey);

            if(checkReserveEventStoredKey) {
                let count = 1;
                count++;
                await this.customersModel.updateEventStoredReserve(JSON.stringify(reserveEventStoredKey), String(count));
                
                return {
                    message: "Event reserved with sucess !",
                    Reserve: {
                        user: reserveEventStoredKey.user,
                        event: reserveEventStoredKey.event,
                        name: reserveEventStoredKey.name,
                        date: reserveEventStoredKey.date,
                        reserveExpiresIn: "4 minutes"
                    }
                }

            }

            await this.customersModel.createEventStoredReserve(JSON.stringify(reserveEventStoredKey), 240, '1');

            return {
                message: "Event reserved with sucess !",
                Reserve: {
                    user: reserveEventStoredKey.user,
                    event: reserveEventStoredKey.event,
                    name: reserveEventStoredKey.name,
                    date: reserveEventStoredKey.date,
                    reserveExpiresIn: "4 minutes"
                }
            }
        }

        await this.eventsService.delete(event_id);

        await this.customersModel.deleteEventStoredKey(JSON.stringify(eventStoredKey));
        await this.customersModel.deleteObjectEventStored(event_id);

        throw new AppError("This event is sold out for this sector !", 400);
    }

}