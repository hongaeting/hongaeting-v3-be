import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CallLog } from './callLog.entity';
import { ICreateCallLog } from './interface/create-callLog.interface';
import { InternalException } from 'src/util/exception/internal.exception';
import { IUpcateCallLog } from './interface/update-callLog.interface';

const MSG_NO_CALL_LOG = 'There is no callLogs.';

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
    const callLogs = await this.callLogsRepository.find();

    if (callLogs.length === 0) throw new InternalException(MSG_NO_CALL_LOG);

    return callLogs;
  }

  async findOne(id: string) {
    const callLog = await this.callLogsRepository.findOne(id);

    if (!callLog) throw new InternalException(MSG_NO_CALL_LOG);

    return callLog;
  }

  async update(id: string, callLogData: IUpcateCallLog) {
    const updateCallLogResult = await this.callLogsRepository.update(
      id,
      callLogData,
    );

    if (updateCallLogResult.affected === 0)
      throw new InternalException(MSG_NO_CALL_LOG);
  }

  async delete(id: string) {
    const deleteCallLogResult = await this.callLogsRepository.delete(id);

    if (deleteCallLogResult.affected === 0)
      throw new InternalException(MSG_NO_CALL_LOG);
  }
}
