import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserController } from './ui/controller/user.controller';
import { UserService } from './application/service/user.service';
import { TypeOrmUserRepository } from './infra/repository/type-orm-user.repository';

@Module({
  providers: [
    UserService,
    ConfigService,
    {
      provide: 'USER_REPOSITORY',
      useClass: TypeOrmUserRepository,
    },
  ],
  controllers: [UserController],
})
export class UsersModule {}
