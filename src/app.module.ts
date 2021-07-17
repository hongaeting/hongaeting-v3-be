import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallLogsModule } from './models/callLogs/callLogs.module';
import { UsersModule } from './models/users/users.module';
import { GendersModule } from './models/genders/genders.module';
import { DepartmentsModule } from './models/departments/departments.module';
import { SignsModule } from './models/signs/signs.module';
import { JwtMiddleware } from './libs/jwt.middleware';
import { ChatsModule } from './models/chats/chats.module';
import { VideoChatsModule } from './videoChats/videoChats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [join(__dirname, '/**/*.entity.js')],
        synchronize: true,
      }),
    }),
    UsersModule,
    CallLogsModule,
    GendersModule,
    DepartmentsModule,
    SignsModule,
    ChatsModule,
    VideoChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
