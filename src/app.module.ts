import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallLogsModule } from './models/callLogs/callLogs.module';
import { UsersModule } from './models/users/users.module';
import { ChatsModule } from './chats/chats.module';
import { VideoChatsModule } from './videoChats/videoChats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['.env.development', '.env.production', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('db.host'),
        port: +configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        entities: [join(__dirname, '/**/*.entity.js')],
        synchronize: true,
      }),
    }),
    UsersModule,
    CallLogsModule,
    ChatsModule,
    VideoChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
