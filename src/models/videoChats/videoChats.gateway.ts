import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { UsersService } from '../users/users.service';
import { QueuesService } from '../queues/queues.service';

@WebSocketGateway({ namespace: 'video-chats', transports: ['websocket'] })
export class VideoChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger(VideoChatsGateway.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly queuesService: QueuesService,
  ) {}

  public afterInit(server: Server): void {
    this.logger.log('Init');
  }

  public handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  public handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('enter-room')
  public joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomid: string; userid: string },
  ) {
    client.join(payload.roomid);
    client.to(payload.roomid).broadcast.emit('user:enter-room', {
      msg: `${payload.userid} 님이 참가하셨습니다.`,
      userId: payload.userid,
    });

    client.on('call-ready', () => {
      client.to(payload.roomid).broadcast.emit('user:call-ready', {
        isCallReady: true,
      });
    });

    client.on('leave-room', () => {
      client.to(payload.roomid).broadcase.emit('user:leave-room', {
        msg: `${payload.userid} 님이 퇴장하셨습니다.`,
      });
      client.leave(payload.roomid);
    });
  }
}
