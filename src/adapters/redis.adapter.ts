import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';

export class RedisIoAdapter extends IoAdapter {
  constructor(app, private readonly configService: ConfigService) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    const redisAdapter = redisIoAdapter({
      host: this.configService.get('redis.host'),
      port: +this.configService.get('redis.port'),
    });

    server.adapter(redisAdapter);
    return server;
  }
}
