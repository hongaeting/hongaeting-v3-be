import {
  Controller,
} from '@nestjs/common';

import { CallLogsService } from './callLogs.service';

@Controller('callLogs')
export class CallLogsController {
  constructor(private readonly callLogsService: CallLogsService) { }
}
