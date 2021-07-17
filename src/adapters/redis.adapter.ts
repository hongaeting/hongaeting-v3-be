import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';

export class RedisIoAdapter extends IoAdapter {
  private readonly logger: Logger = new Logger('RedisIoAdapter');

  constructor(
    private readonly app,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    const redisAdapter = redisIoAdapter({
      host: this.configService.get('REDIS_HOST'),
      port: +this.configService.get('REDIS_POSR'),
    });

    server.adapter(redisAdapter);
    return server;
  }
}
