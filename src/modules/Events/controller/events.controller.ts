import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "../../../utils/authGuard/auth.guard.js";
import { EventsService } from "../service/events.service.js";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { Events } from "../model/entity/events.js";

@Controller("api/events")
@UseInterceptors(CacheInterceptor)
export class EventsController {

    constructor(private readonly eventsService: EventsService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Query("user_id") user_id: string, @Body() body: Events) {
        const resp = await this.eventsService.create(body, user_id);
        
        const { id, name, date, place, availableSectors, quantity, createdAt } = resp;

        return {
            id,
            name,
            date,
            place,
            availableSectors,
            quantity: Number(quantity),
            createdAt,
            user_id: user_id
        }

    }

    @UseGuards(AuthGuard)
    @Get(":event_id")
    async getEvent(@Query("event_id") event_id: string) {
        return await this.eventsService.getEvent(event_id);
    }

}