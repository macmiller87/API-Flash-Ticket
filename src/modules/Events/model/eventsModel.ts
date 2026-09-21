import { IEventsModel } from "./implementation-IEventsModel/iEventsModel.js";
import { EventsSectors } from "../../../prismaORM/generated/prisma/enums.js";
import { PrismaService } from "../../../prismaORM/prisma/prismaService.js";
import { Events, IEventsDTO } from "./entity/events.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventsModel implements IEventsModel {

    constructor(private readonly prismaService: PrismaService) {}

    async create(request: IEventsDTO, user_id: string): Promise<Events> {

        const sector = request.availableSectors === "ECONOMIC" ? EventsSectors.ECONOMIC : request.availableSectors === "PREMIUM" ? EventsSectors.PREMIUM : EventsSectors.DYAMOND;

        const create = await this.prismaService.events.create({

            data: {
                name: request.name,
                date: request.date,
                place: request.place,
                availableSectors: sector,
                quantity: request.quantity,
                price: request.price,
                user_id: user_id
            }

        });

        return new Events({
            id: create.id,
            name: create.name,
            date: create.date,
            place: create.place,
            availableSectors: create.availableSectors,
            quantity: create.quantity,
            price: Number(create.price),
            createdAt: create.createdAt
        });

    }

    async increEventQuantityById(event_id: string): Promise<Events> {
        const update = await this.prismaService.events.update({
            where: {
                id: event_id
            },
            data: {
                quantity: {
                    increment: 1
                }
            }
        });

        return new Events({
            id: update.id,
            name: update.name,
            date: update.date,
            place: update.place,
            availableSectors: update.availableSectors,
            quantity: update.quantity,
            price: Number(update.price),
            createdAt: update.createdAt
        });

    }

    async decreEventQuantityById(event_id: string): Promise<Events> {
        const update = await this.prismaService.events.update({
            where: {
                id: event_id
            },
            data: {
                quantity: {
                    decrement: 1
                }
            }
        });

        return new Events({
            id: update.id,
            name: update.name,
            date: update.date,
            place: update.place,
            availableSectors: update.availableSectors,
            quantity: update.quantity,
            price: Number(update.price),
            createdAt: update.createdAt
        });

    }

    async delete(event_id: string): Promise<void> {
        await this.prismaService.events.delete({
            where: {
                id: event_id
            }
        });
    }

}