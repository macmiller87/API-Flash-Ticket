import { ICustomersModel } from "../../../modules/Customers/model/implementation-ICustomersModel/iCustomersModel.js";   
import type { IEventReserveDTO } from "../../../modules/Customers/model/entity/reserveEventStoredKey.js";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { PrismaService } from "../../../prismaORM/prisma/prismaService.js";
import { Controller, Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Controller()
@Injectable()
export class RabbitmqService {

    constructor(
        @Inject('TICKET_SERVICE') private readonly rabbitmqClient: ClientProxy,
        private readonly customersModel: ICustomersModel,
        private readonly prismaService: PrismaService
    ) {}

    async orderCheckoutEvent(data: IEventReserveDTO): Promise<object> {
        const send = await firstValueFrom(
            this.rabbitmqClient.send("Reserve.checkout", {
                data
            }),
        )

        return send;
    }

    @MessagePattern("Reserve.checkout")
    async handleOrderCheckout(@Payload() payload: any): Promise<object> {

        const { data } = payload;

        try {
            const create = await this.prismaService.eventsPurchased.create({
                data: {
                    user: data.user,
                    event: data.event,
                    name: data.name,
                    date: data.date,
                    place: data.place,
                    sector: data.sector,
                    quantity: data.quantity,
                }
            });

            const statusKey = `status:${data.event}`;
            await this.customersModel.updateReserveStatusKey(statusKey, "success"); 
            const getReserveStatusKey = await this.customersModel.getReserveStatusKey(statusKey);

            return {
                message: `Event purchased with ${getReserveStatusKey} !`,
                event: create
            }
            
        }catch(error: unknown) {
            return {
                message: "Event purchase not validated",
                error
            }
        }
        
    }

}