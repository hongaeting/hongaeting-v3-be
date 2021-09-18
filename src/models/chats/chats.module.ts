import { Module } from '@nestjs/common';

import { ChatsGateway } from './chats.gateway';
import { UsersModule } from '../users/users.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [UsersModule, QueuesModule],
  controllers: [],
  providers: [ChatsGateway],
})
export class ChatsModule {}
