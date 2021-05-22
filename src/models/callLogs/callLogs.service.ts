import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CallLog } from './callLog.entity';

@Injectable()
export class CallLogsService {
  constructor(
    @InjectRepository(CallLog)
    private callLogsRepository: Repository<CallLog>,
  ) { }
}
