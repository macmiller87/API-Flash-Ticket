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
        const place = data.place;
        const availableSectors = data.availableSectors;
        const price = data.price;

        const redisKeyEvent = `Event:${event_id}`;

        const curentEventStoredKey = await this.customersModel.decreEventStoredKey(redisKeyEvent);

        const reserveEventStoredKey = {
            event: event_id,
            name: name,
            date: date,
            place: place,
            sector: availableSectors,
            quantity: 1,
            price: price
        }

        const redisKeyReserve = `Reserve:${event_id}:User:${user_id}`;

        if(curentEventStoredKey >= 0) {
            await this.eventsService.decreEventQuantityById(event_id);

            const checkReserveEventStoredKey = await this.customersModel.getReserveEventStoredKey(user_id, event_id);

            if(checkReserveEventStoredKey) {
                let count = 1;
                count++;
                await this.customersModel.updateEventStoredReserve(redisKeyReserve, count);
                
                return {
                    message: "Event reserved with sucess !",
                    Reserve: {
                        user: user_id,
                        event: reserveEventStoredKey.event,
                        name: reserveEventStoredKey.name,
                        date: reserveEventStoredKey.date,
                        place: reserveEventStoredKey.place,
                        sector: reserveEventStoredKey.sector,
                        quantity: count,
                        price: reserveEventStoredKey.price,
                        reserveExpiresIn: "4 minutes"
                    }
                }

            }

            await this.customersModel.createEventStoredReserve(redisKeyReserve, reserveEventStoredKey, 240);

            return {
                message: "Event reserved with sucess !",
                Reserve: {
                    user: user_id,
                    event: reserveEventStoredKey.event,
                    name: reserveEventStoredKey.name,
                    date: reserveEventStoredKey.date,
                    place: reserveEventStoredKey.place,
                    sector: reserveEventStoredKey.sector,
                    quantity: 1,
                    price: reserveEventStoredKey.price,
                    reserveExpiresIn: "4 minutes"
                }
            }
        }

        await this.eventsService.delete(event_id);

        await this.customersModel.deleteEventStoredKey(redisKeyEvent);
        await this.customersModel.deleteObjectEventStored(event_id);

        throw new AppError("This event is sold out for this sector !", 400);
    }

    async deleteEventReserve(user_id: string, event_id: string): Promise<object> {
        const findUserById = await this.usersService.findUserById(user_id);

        if(findUserById) {
            const findEventById = await this.customersModel.findEventById(event_id);

            if(findEventById === null) {
                throw new AppError("Event Not Found !", 404);
            }

            await this.eventsService.increEventQuantityById(event_id);

            const redisKeyEvent = `Event:${event_id}`;
            await this.customersModel.increEventStoredKey(redisKeyEvent);

            const redisKeyReserve = `Reserve:${event_id}:User:${user_id}`;
            await this.customersModel.deleteEventReserve(redisKeyReserve);

            return {
                message: "Event reserve deleted with sucess !"
            }

        }

        throw new AppError("User Not found !", 404);
    }

}