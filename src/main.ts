import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

import { RedisIoAdapter } from './adapters/redis.adapter';
import { AppModule } from './app.module';

const getHttpsOptions = ():
  | { httpsOptions: { key: string; cert: string; ca: string } }
  | undefined => {
  const secretDirPath: string = join(__dirname, '..', 'secrets');

  if (existsSync(secretDirPath)) {
    const [key, cert, ca] = ['privkey.pem', 'cert.pem', 'fullchain.pem'].map(
      (filename) => readFileSync(join(secretDirPath, filename), 'utf8'),
    );

    return { httpsOptions: { key, cert, ca } };
  }
};

const bootstrap = async () => {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule, getHttpsOptions());
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useWebSocketAdapter(new RedisIoAdapter(app, configService));
  app.setGlobalPrefix(`api/${configService.get('API_VERSION')}`);

  await app.listen(configService.get('API_PORT') ?? 3000);
};

bootstrap();
