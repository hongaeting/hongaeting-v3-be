import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisIoAdapter } from './adapters/redis.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new RedisIoAdapter(app, configService));

  await app.listen(configService.get('API_PORT') ?? 3000);
}

bootstrap();
