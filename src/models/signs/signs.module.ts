import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { SignsController } from './signs.controller';
import { SignsService } from './signs.service';
import { SignUp } from './signUp.entity';
import { SignIn } from './signIn.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SignUp, SignIn]),
    UsersModule,
    ConfigService,
  ],
  controllers: [SignsController],
  providers: [SignsService],
})
export class SignsModule {}
