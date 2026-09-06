import { AppModule, ObserveInstrument } from './app.module.js';
import { AppError } from './utils/errors/appError.js';
import { NestFactory } from '@nestjs/core';
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const port = Number(process.env.PORT);
  await app.listen(port);
  
  console.log(`Server is running at ${await app.getUrl()}`)

  app.use((erro: Error, request: express.Request, response: express.Response) => {

    if(erro instanceof AppError) {
        return response.status(erro.statusCode).json({ message: erro.message });
    }

    return response.status(500).json({
        status: "error",
        message: `Internal Server Error ${erro.message}`
    });

  });

}

await bootstrap();
