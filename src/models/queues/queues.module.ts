import { Module } from '@nestjs/common';

import { QueuesService } from './queues.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), UsersModule],
  controllers: [],
  providers: [QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
