import { Module } from '@nestjs/common';
import { VideoChatsGateway } from './videoChats.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [VideoChatsGateway],
})
export class VideoChatsModule {}
