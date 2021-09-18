import { Module } from '@nestjs/common';

import { VideoChatsGateway } from './videoChats.gateway';
import { UsersModule } from '../users/users.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [UsersModule, QueuesModule],
  controllers: [],
  providers: [VideoChatsGateway],
})
export class VideoChatsModule {}
