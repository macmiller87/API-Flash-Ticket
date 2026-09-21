import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../utils/authGuard/auth.guard.js";
import { EventsService } from "../service/events.service.js";
import { Events } from "../model/entity/events.js";

@Controller("api/events")
export class EventsController {

    constructor(private readonly eventsService: EventsService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Query("user_id") user_id: string, @Body() body: Events) {
        const resp = await this.eventsService.create(body, user_id);
        
        const { id, name, date, place, availableSectors, quantity, price, createdAt } = resp;

        return {
            id,
            name,
            date,
            place,
            availableSectors,
            quantity: Number(quantity),
            price: Number(price),
            createdAt,
            user_id: user_id
        }

    }

    @UseGuards(AuthGuard)
    @Get(":event_id")
    async getEvent(@Query("event_id") event_id: string) {
        return await this.eventsService.getEvent(event_id);
    }

    @UseGuards(AuthGuard)
    @Delete("deleteEvent/:event_id")
    async deleteEvent(@Query("event_id") event_id: string) {
        return await this.eventsService.deleteEvent(event_id);
    }

}