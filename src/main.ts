import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

import { RedisIoAdapter } from './adapters/redis.adapter';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const { NODE_ENV, SSL_KEY, SSL_CERT, SSL_CHAIN } = process.env;
  const app = await NestFactory.create(
    AppModule,
    NODE_ENV === 'production'
      ? {
          httpsOptions: {
            key: fs.readFileSync(
              path.join(__dirname, '..', 'secrets', SSL_KEY),
              'utf8',
            ),
            cert: fs.readFileSync(
              path.join(__dirname, '..', 'secrets', SSL_CERT),
              'utf8',
            ),
            ca: fs.readFileSync(
              path.join(__dirname, '..', 'secrets', SSL_CHAIN),
              'utf8',
            ),
          },
        }
      : undefined,
  );

  const configService = app.get(ConfigService);
  app.setGlobalPrefix(`api/${configService.get('API_VERSION')}`);
  app.useWebSocketAdapter(new RedisIoAdapter(app, configService));
  app.use(cookieParser());

  await app.listen(configService.get('API_PORT') ?? 3000);
}

bootstrap();
