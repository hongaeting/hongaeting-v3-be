import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CallLogsService } from './callLogs.service';
import { CreateCallLogDto } from './interface/create-callLog.dto';
import { UpdateCallLogDto } from './interface/update-callLog.dto';
import { CallLog } from './callLog.entity';

@Controller('callLogs')
export class CallLogsController {
  constructor(private readonly callLogsService: CallLogsService) {}

  @Post()
  async createCallLog(@Body() createCallLogDto: CreateCallLogDto) {
    return await this.callLogsService
      .createCallLog(createCallLogDto)
      .then((res) => res.identifiers[0])
      .catch((e) => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Get()
  async getCallLogs() {
    return await this.callLogsService.findAll();
  }

  @Get(':id')
  async getCallLog(@Param('id') id: number) {
    const callLog = await this.callLogsService.findOne(id);

    if (!callLog) {
      throw new HttpException(
        'There is no matching call-log',
        HttpStatus.BAD_REQUEST,
      );
    }

    return callLog;
  }

  @Patch(':id')
  async updateCallLog(
    @Param('id') id: number,
    @Body() update: UpdateCallLogDto,
  ) {
    return this.callLogsService
      .updateCallLog(id, update)
      .then((res) => {
        if (res.affected == 0) {
          throw new HttpException(
            'There is no matching call-log',
            HttpStatus.BAD_REQUEST,
          );
        }

        return 'Success to update!';
      })
      .catch((e) => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Delete(':id')
  async deleteCallLog(@Param('id') id: number) {
    return this.callLogsService
      .delete(id)
      .then((res) => {
        if (res.affected == 0) {
          throw new HttpException(
            'There is no matching call-log',
            HttpStatus.BAD_REQUEST,
          );
        }

        return 'Success to delete!';
      })
      .catch((e) => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }
}
