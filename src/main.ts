import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const port = Number(process.env.PORT);
  await app.listen(port);
  
  console.log(`Server is running at ${await app.getUrl()}`)
}

await bootstrap();
