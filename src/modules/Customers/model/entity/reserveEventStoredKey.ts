export interface IReserveEventStoredKeyDTO {
    event: string;
    name: string;
    date: string;
    sector: string;
    quantity: number;
}

export interface IEventReserveDTO {
    status?: string | null;
    user: string;
    userBalance?: number;
    event: string;
    name: string;
    date: string;
    place: string;
    sector: string;
    quantity: number;
    price?: number;
}