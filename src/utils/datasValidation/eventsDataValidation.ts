import { IEventsDTO } from "../../modules/Events/model/entity/events.js";
import { AppError } from "../errors/appError.js";

export async function eventsDataValidation(datas: IEventsDTO) {

    if(datas.name === "" || datas.date === "" || datas.place === "" || datas.availableSectors === "") {
        throw new AppError("All fields must be filled in", 401);
    }

    if(typeof(datas.name) !== "string" || typeof(datas.date)  !== "string" || typeof(datas.place)  !== "string" || typeof(datas.availableSectors)  !== "string") {
        throw new AppError("All datas must be 'string", 401);
    }

    if(typeof(datas.quantity) != "number" || typeof(datas.price) != "number") {
        throw new AppError("Quantity or Price field must be a 'int number'", 401);
    }

    return true;
}