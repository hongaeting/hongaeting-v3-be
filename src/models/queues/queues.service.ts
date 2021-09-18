import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, QueryRunner, Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { nanoid } from 'nanoid';

import { Queue } from './queue.entity';
import { CancelMatchingDto, RequestMatchingDto } from './queues.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class QueuesService {
  private readonly logger: Logger = new Logger(QueuesService.name);

  constructor(
    private readonly connection: Connection,
    private readonly usersService: UsersService,
    @InjectRepository(Queue)
    private readonly queuesRepository: Repository<Queue>,
  ) {}

  public async getUserFromSocket(client: Socket) {
    const cookies =
      client?.client?.request?.headers?.cookie
        ?.split(';')
        .map((kv) => kv.split('='))
        .reduce(
          (cookies, [k, v]) => ({ ...cookies, [k.trim()]: v.trim() }),
          {},
        ) ?? {};

    return this.usersService.getUserByAccessToken(cookies['AccessToken'] ?? '');
  }

  public async requestMatching(user: User): Promise<RequestMatchingDto> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let result: RequestMatchingDto;

    try {
      result = await QueuesService.addOrUpdateQueue(queryRunner, user);
      await queryRunner.commitTransaction();
    } catch (error) {
      result = { result: 'ERROR', error };
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return result;
  }

  private static async addOrUpdateQueue(
    queryRunner: QueryRunner,
    user: User,
  ): Promise<RequestMatchingDto> {
    const requestUserIdColumn =
      user.gender.id === 1 ? 'maleUserId' : 'maleUserId';

    const requestQueue = { [requestUserIdColumn]: user.id };
    const waitingQueue = await queryRunner.manager.findOne(Queue, {
      where: { [requestUserIdColumn]: IsNull(), deletedAt: IsNull() },
      order: { createdAt: 'ASC' },
    });

    if (!waitingQueue) {
      const roomId = nanoid();
      await queryRunner.manager.create(Queue, { ...requestQueue, roomId });
      return { result: 'WAITING', roomId };
    }

    await queryRunner.manager.update(Queue, waitingQueue.id, requestQueue);
    return {
      result: 'MATCHING',
      roomId: waitingQueue.roomId,
      queue: { ...waitingQueue, ...requestQueue },
    };
  }

  public async cancelMatching(user: User): Promise<CancelMatchingDto> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let result: CancelMatchingDto = { result: 'FAIL' };

    try {
      const { requestUserIdColumn, waitingUserIdColumn } =
        user.gender.id === 1
          ? {
              requestUserIdColumn: 'maleUserId',
              waitingUserIdColumn: 'femaleUserId',
            }
          : {
              requestUserIdColumn: 'femaleUserId',
              waitingUserIdColumn: 'maleUserId',
            };
      await queryRunner.manager.softDelete(Queue, {
        [requestUserIdColumn]: user.id,
        [waitingUserIdColumn]: IsNull(),
      });

      result = { result: 'SUCCESS' };
      await queryRunner.commitTransaction();
    } catch (error) {
      result = { result: 'ERROR', error };
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return result;
  }
}
