import { RmqOptions, Transport } from "@nestjs/microservices";

export const rabbitmqConfig: RmqOptions = {
    transport: Transport.RMQ,
    options: {
        urls: [String(process.env.RABBITMQ_URL)],
        queue: "orderCheckoutEvent_queue",
        noAck: true,
        queueOptions: {
            durable: false
        },
    }
} 