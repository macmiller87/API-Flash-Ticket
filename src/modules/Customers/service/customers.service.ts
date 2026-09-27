import { IEventsModel } from "../../Events/model/implementation-IEventsModel/iEventsModel.js";
import { ICustomersModel } from "../model/implementation-ICustomersModel/iCustomersModel.js";
import { IUsersModel } from "../../Users/model/implementation-IUsersModel/iUsersModel.js";
import { RabbitmqService } from "../../../utils/rabbitmq/service/rabbitmqService.js";
import { AppError } from "../../../utils/errors/appError.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomersService {

    constructor(
        private readonly usersService: IUsersModel,
        private readonly eventsService: IEventsModel,
        private readonly customersModel: ICustomersModel,
        private readonly rabbitmqClient: RabbitmqService
    ) {}

    async createEventsReserve(user_id: string, event_id: string, ): Promise<object> {
        const findUserById = await this.usersService.findUserById(user_id);

        if(!findUserById) {
            throw new AppError("User Not Found !", 404);
        }

        if(findUserById._admin === "ADMIN") {
            throw new AppError("ADMIN user can't do this operation !", 404);
        }

        const redisKeyEvent = `Event:${event_id}`;
        const findEventById = await this.customersModel.findEventById(redisKeyEvent);
        
        if(findEventById === null) {
            throw new AppError("Event Not Found !", 404);
        }

        const data = JSON.parse(JSON.stringify(findEventById));
        const name = data.name;
        const date = data.date;
        const place = data.place;
        const availableSectors = data.sector;
        const price = Number(data.price);

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

        const expiresIn = Number(process.env.REDIS_KEY_RESERVE_EXPIRESIN);
        const redisKeyReserve = `Reserve:${event_id}:User:${user_id}`;

        if(curentEventStoredKey >= 0) {
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
                        reserveExpiresIn: `${expiresIn / 60} minutes`
                    }
                }

            }

            await this.customersModel.createEventStoredReserve(redisKeyReserve, reserveEventStoredKey, expiresIn);

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
                    reserveExpiresIn: `${expiresIn / 60} minutes`
                }
            }
        }

        await this.eventsService.delete(event_id);
        await this.customersModel.deleteEventStoredKey(redisKeyEvent);

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

    async orderCheckoutEvent(user_id: string, reserve_id: string):  Promise<object> {
        const findUserById = await this.usersService.findUserById(user_id);

        if(!findUserById) {
            throw new AppError("User Not found !", 404);
        }
        
        if(findUserById._admin === "ADMIN") {
            throw new AppError("ADMIN user can't do this operation !", 404);
        }

        const redisKeyReserve = `Reserve:${reserve_id}:User:${user_id}`;
        const findReserveById = await this.customersModel.findReserveById(redisKeyReserve);

        if(!findReserveById || findReserveById === null || Object.keys(findReserveById).length === 0) {
            throw new AppError("Reserve Not found !", 404);
        }

        const data = JSON.parse(JSON.stringify(findReserveById));
        const name = data.name;
        const date = data.date;
        const place = data.place;
        const availableSectors = data.sector;
        const price = Number(data.price);

        const userBlance = Number(findUserById._wallet?.balance);

        const eventReserve = {
            user: user_id,
            event: reserve_id,
            name: name,
            date: date,
            place: place,
            sector: availableSectors,
            quantity: 1,
        }

        const expiresIn = Number(process.env.REDIS_KEY_RESERVE_EXPIRESIN);

        const checkUserBalance = userBlance >= price ? true : false; 

        const curentReserveStoredKey = await this.customersModel.decreReserveStoredKey(redisKeyReserve);


        if(checkUserBalance === true && curentReserveStoredKey >= 0) {
            const mathOperatation = userBlance - price;
            const res = mathOperatation;

            if(curentReserveStoredKey === 0) {
                await this.usersService.updateUserBalance(user_id, res);

                const statusKey = `status:${reserve_id}`;
                await this.customersModel.reserveStatusKey(statusKey, "processing", expiresIn); 

                const rabbitmqResponse = await this.rabbitmqClient.orderCheckoutEvent(eventReserve);
                return rabbitmqResponse;
            }

            let count = 0;
            count++;
            await this.customersModel.updateEventStoredReserve(redisKeyReserve, count);

            const res2 = res;

            await this.usersService.updateUserBalance(user_id, res2);

            const statusKey = `status:${reserve_id}`;
            await this.customersModel.reserveStatusKey(statusKey, "processing", expiresIn); 

            const rabbitmqResponse = await this.rabbitmqClient.orderCheckoutEvent(eventReserve);
            
            return rabbitmqResponse;
        }

        if(curentReserveStoredKey < 0) {
            await this.customersModel.deleteReserveEventStoredKey(redisKeyReserve);

            throw new AppError("This Reserve is sold out for this sector !", 400);
        }

        throw new AppError("User dont have enougth balance", 401);      
    }

}