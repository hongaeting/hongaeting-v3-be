import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CallLog } from './callLog.entity';
import { CallLogsService } from './callLogs.service';
import { CallLogsController } from './callLogs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CallLog])],
  providers: [CallLogsService],
  controllers: [CallLogsController],
})
export class CallLogsModule { }
