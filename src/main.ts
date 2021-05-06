import { NestFactory } from '@nestjs/core';
import { RedisIoAdapter } from './adapters/redis.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new RedisIoAdapter());

  await app.listen(3000);
}
bootstrap();
