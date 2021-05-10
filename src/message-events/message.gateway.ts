import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws';

@WebSocketGateway({ namespace: '/chat' })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client connected: ${client.id}`);
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('msgToServer')
  public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
    return this.server.to(payload.room).emit('msgToClient', payload);
  }
}
