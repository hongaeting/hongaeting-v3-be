import { HttpException, HttpStatus, Logger } from '@nestjs/common';
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
import { RequestMatchingDto } from '../queues/queues.dto';

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

  @SubscribeMessage('request-matching')
  public async requestMatching(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const user = await this.queuesService.getUserFromSocket(client);

    if (!user) {
      // Todo: 에러 반환
      return;
    }

    const result: RequestMatchingDto = await this.queuesService.requestMatching(
      user,
    );

    if (result.result === 'ERROR') {
      // Todo: 에러 반환
      return;
    }

    client.join(result.roomId);

    client.emit('user:matching-status', {
      msg: result.result,
      payload: { result, roomId: result.roomId },
    });

    client.broadcast.to(result.roomId).emit('user:matching-complete', {
      payload: { roomId: result.roomId, otherPeerId: payload.peerId },
    });

    client.on('end-calling', () => {
      client.broadcast.to(result.roomId).emit('user:calling-ended');
      client.leave(payload.roomId);
    });
  }

  @SubscribeMessage('send-peer-id')
  public async sendPeerId(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { peerId: string; roomId: string },
  ) {
    client.broadcast.to(payload.roomId).emit('matched-peer-id', {
      peerId: payload.peerId,
    });
  }

  @SubscribeMessage('cancel-matching')
  public async cancelMatching(
    @ConnectedSocket() client: Socket,
    // @MessageBody() payload: any,
  ) {
    const user = await this.queuesService.getUserFromSocket(client);

    if (!user) {
      // 에러 반환

      return;
    }

    await this.queuesService.cancelMatching(user);
  }

  // @SubscribeMessage('enter-room')
  // public async joinRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: { roomid: string; userid: string },
  // ) {
  //   const user = await this.queuesService.getUserFromSocket(client);

  //   if (!user) {
  //     // 에러 반환
  //   }

  //   client.join(payload.roomid);
  //   client.to(payload.roomid).broadcast.emit('user:enter-room', {
  //     msg: `${payload.userid} 님이 참가하셨습니다.`,
  //     userId: payload.userid,
  //   });

  //   client.on('call-ready', () => {
  //     client.to(payload.roomid).broadcast.emit('user:call-ready', {
  //       isCallReady: true,
  //     });
  //   });

  //   client.on('leave-room', () => {
  //     client.to(payload.roomid).broadcase.emit('user:leave-room', {
  //       msg: `${payload.userid} 님이 퇴장하셨습니다.`,
  //     });
  //     client.leave(payload.roomid);
  //   });
  // }
}
