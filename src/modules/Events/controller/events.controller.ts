import { Body, Controller, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../utils/authGuard/auth.guard.js";
import { EventsService } from "../service/events.service.js";
import { Events } from "../model/entity/events.js";

@Controller("api/events")
export class EventsController {

    constructor(private readonly eventsService: EventsService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Query("user_id") user_id: string, @Body() body: Events) {
        return await this.eventsService.create(body, user_id);
    }

}