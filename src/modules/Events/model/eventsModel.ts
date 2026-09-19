import { IEventsModel } from "./implementation-IEventsModel/iEventsModel.js";
import { EventsSectors } from "../../../prismaORM/generated/prisma/enums.js";
import { PrismaService } from "../../../prismaORM/prisma/prismaService.js";
import { Events, IEventsDTO } from "./entity/events.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventsModel implements IEventsModel {

    constructor(private readonly prismaService: PrismaService) {}

    async create(request: IEventsDTO, user_id: string): Promise<Events | any> {

        const create = await this.prismaService.events.create({
            data: {
                name: request.name,
                date: request.date,
                place: request.place,
                availableSectors: request.availableSectors === "ECONOMIC" ? EventsSectors.ECONOMIC : request.availableSectors as any,
                quantity: request.quantity,
                user_id: user_id
            }

        });

        return create;
    }

    async increEventQuantityById(event_id: string): Promise<Events | null> {
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

        return update;
    }

    async decreEventQuantityById(event_id: string): Promise<Events | null> {
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

        return update;
    }

    async delete(event_id: string): Promise<void> {
        await this.prismaService.events.delete({
            where: {
                id: event_id
            }
        });
    }

}