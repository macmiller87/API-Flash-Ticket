import { PrismaClient } from "@prisma/client/extension"
import { PrismaPg } from "@prisma/adapter-pg";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient {

    constructor() {
        const databaseUrl = `${process.env.DATABASE_URL}`;

        super({
            log: ["query"],
            adapter: new PrismaPg({
                database: databaseUrl
            })
        });

    }

}