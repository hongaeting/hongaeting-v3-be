import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CallLog } from './callLog.entity';
import { CreateCallLogDto } from './interface/create-callLog.dto';
import { UpdateCallLogDto } from './interface/update-callLog.dto';

@Injectable()
export class CallLogsService {
  constructor(
    @InjectRepository(CallLog)
    private callLogsRepository: Repository<CallLog>,
  ) {}

  createCallLog(callLog: CreateCallLogDto) {
    return this.callLogsRepository
      .createQueryBuilder()
      .insert()
      .into(CallLog)
      .values({ ...callLog })
      .execute();
  }

  async findOne(id: number) {
    const callLog = await this.callLogsRepository
      .createQueryBuilder('callLog')
      .where({ id: id })
      .leftJoinAndSelect('callLog.caller', 'caller')
      .leftJoinAndSelect('callLog.callee', 'callee')
      .getOne();

    return callLog;
  }

  async findAll() {
    const callLogs = await this.callLogsRepository
      .createQueryBuilder('callLog')
      .leftJoinAndSelect('callLog.caller', 'caller')
      .leftJoinAndSelect('callLog.callee', 'callee')
      .getMany();

    return callLogs;
  }

  updateCallLog(id: number, updateCallLogDto: UpdateCallLogDto) {
    return this.callLogsRepository
      .createQueryBuilder()
      .update(updateCallLogDto)
      .where('id = :id', { id: id })
      .execute();
  }

  delete(id: number) {
    return this.callLogsRepository.delete(id);
  }
}
