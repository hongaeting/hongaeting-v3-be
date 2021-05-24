import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CallLog } from './callLog.entity';
import { ICreateCallLog } from './interface/create-callLog.interface';
import { IUpcateCallLog } from './interface/update-callLog.interface';

@Injectable()
export class CallLogsService {
  constructor(
    @InjectRepository(CallLog)
    private callLogsRepository: Repository<CallLog>,
  ) {}

  async create(callLogData: ICreateCallLog) {
    await this.callLogsRepository
      .createQueryBuilder()
      .insert()
      .into(CallLog)
      .values([{ ...callLogData }])
      .execute();
  }

  async findAll() {
    return await this.callLogsRepository.find();
  }

  async findOne(id: string) {
    return await this.callLogsRepository.findOne(id);
  }

  async update(id: string, callLogData: IUpcateCallLog) {
    return await this.callLogsRepository.update(id, callLogData);
  }

  async delete(id: string) {
    return await this.callLogsRepository.delete(id);
  }
}
