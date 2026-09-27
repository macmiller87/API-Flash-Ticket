import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger'; 
import { rabbitmqConfig } from './utils/rabbitmq/config/rabbitmqConfig.js';
import { AppModule, ObserveInstrument } from './app.module.js';
import { AppError } from './utils/errors/appError.js';
import { NestFactory } from '@nestjs/core';
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.connectMicroservice(rabbitmqConfig);
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle("API-Flash-Ticket")
    .setDescription('This is an API for controlling, managing and selling different types of tickets.')
    .setContact('Macmiller Duarte', '', 'macamagolf@gmail.com')
    .setVersion('1.0')
    .addTag("Users / Customers / Events")
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config, options);
  
  SwaggerModule.setup("api-doc", app, documentFactory, {
    jsonDocumentUrl: "swagger/json",
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
