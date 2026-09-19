import { CustomersService } from "../service/customers.service.js";
import { Controller, Delete, Post, Query } from "@nestjs/common";

@Controller("api/customers")
export class CustomersController {

    constructor(private readonly customersService: CustomersService) {}

    @Post("createEventReserve")
    async createEventsReserve(@Query("user_id") user_id: string, @Query("event_id") event_id: string) {
        return await this.customersService.createEventsReserve(user_id, event_id);
    }

    @Delete("deleteReserve")
    async deleteReserve(@Query("user_id") user_id: string, @Query("event_id") event_id: string) {
        return await this.customersService.deleteEventReserve(user_id, event_id);
    }

}