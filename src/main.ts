import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

import { RedisIoAdapter } from './adapters/redis.adapter';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(
      path.join(__dirname, '..', ...(process.env?.SSL_KEY ?? '').split('/')),
      'utf8',
    ),
    cert: fs.readFileSync(
      path.join(__dirname, '..', ...(process.env?.SSL_CERT ?? '').split('/')),
      'utf8',
    ),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions: process.env.NODE_ENV === 'development' ? {} : httpsOptions,
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(`api/${configService.get('API_VERSION')}`);
  app.useWebSocketAdapter(new RedisIoAdapter(app, configService));
  app.use(cookieParser());

  await app.listen(configService.get('API_PORT') ?? 3000);
}

bootstrap();
