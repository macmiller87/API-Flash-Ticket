export interface IEventsDTO {
    id?: string;
    name: string;
    date: string
    place: string;
    availableSectors?: string;
    quantity: number;
    price: number;
    createdAt?: Date;
}

export class Events implements IEventsDTO {
    private _id?: string;
    private _name: string;
    private _date: string;
    private _place: string;
    private _availableSectors?: string;
    private _quantity: number;
    private _price: number;
    private _createdAt?: Date;

    constructor(props: IEventsDTO) {
        this._id = props.id;
        this._name = props.name;
        this._date = props.date;
        this._place = props.place;
        this._availableSectors = props.availableSectors;
        this._quantity = props.quantity;
        this._price = props.price;
        this._createdAt = props.createdAt;
    }

    public set id(id: string | undefined) {
        this._id = id;
    }

    public get id(): string | undefined {
        return this._id;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get name(): string {
        return this._name;
    }

    public set date(date: string) {
        this._date = date;
    }

    public get date(): string {
        return this._date;
    }

    public set place(place: string) {
        this._place = place;
    }

    public get place(): string {
        return this._place;
    }
    
    public set availableSectors(availableSectors:  string | undefined) {
        this._availableSectors = availableSectors;
    }

    public get availableSectors(): string | undefined {
        return this._availableSectors;
    }

    public set quantity(quantity: number) {
        this._quantity = quantity;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public set price(price: number) {
        this._price = price;
    }

    public get price(): number {
        return this._price;
    }

    public set createdAt(createdAt: Date | undefined) {
        this._createdAt = createdAt;
    }

    public get createdAt(): Date | undefined{
        return this._createdAt;
    }

}