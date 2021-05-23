import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'chats', transports: ['websocket'] })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

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
  public joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<WsResponse<any>> {
    client.join(payload.room);
    client.emit('joinedRoom', payload.room);
    return this.server.to(payload.room).emit('msgToClient', payload);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<WsResponse<any>> {
    client.leave(payload.room);
    client.emit('leftRoom', payload.room);
    return this.server.to(payload.room).emit('msgToClient', payload);
  }

  @SubscribeMessage('msgToServer')
  public handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<WsResponse<any>> {
    return this.server.to(payload.room).emit('msgToClient', payload);
  }
}
