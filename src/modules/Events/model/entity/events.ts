export interface IEventsDTO {
    id?: string;
    name: string;
    date: string
    place: string;
    availableSectors?: string;
    quantity: number;
    createdAt?: Date;
}

export class Events {

    public set id(id: string) {
        this.id = id;
    }

    public get id(): string {
        return this.id;
    }

    public set name(name: string) {
        this.name = name;
    }

    public get name(): string {
        return this.name;
    }

    public set date(date: string) {
        this.date = date;
    }

    public get date(): string {
        return this.date;
    }

    public set place(place: string) {
        this.place = place;
    }

    public get place(): string {
        return this.place;
    }
    
    public set availableSectors(availableSectors: string) {
        this.availableSectors = availableSectors;
    }

    public get availableSectors(): string {
        return this.availableSectors;
    }

    public set quantity(quantity: number) {
        this.quantity = quantity;
    }

    public get quantity(): number {
        return this.quantity;
    }

    public set createdAt(createdAt: Date) {
        this.createdAt = createdAt;
    }

    public get createdAt(): Date {
        return this.createdAt;
    }

}