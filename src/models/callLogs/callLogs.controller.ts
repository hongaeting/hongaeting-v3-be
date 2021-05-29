import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseInterceptors,
} from '@nestjs/common';

import { CallLogsService } from './callLogs.service';
import { CreateCallLogDto } from './dto/create-callLog.dto';
import { UpdateCallLogDto } from './dto/update-callLog.dto';
import { NotFoundInterceptor } from 'src/interceptors/notFound.interceptor';

@Controller('call-logs')
@UseInterceptors(NotFoundInterceptor)
export class CallLogsController {
  constructor(private readonly callLogsService: CallLogsService) {}

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.callLogsService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.callLogsService.findAll();
  }

  @Post()
  async create(@Body() createCallLogDto: CreateCallLogDto) {
    await this.callLogsService.create(createCallLogDto);

    return true;
  }

  @Patch(':id')
  async modify(
    @Param('id') id: string,
    @Body() updateCallLogDto: UpdateCallLogDto,
  ) {
    return await this.callLogsService.update(id, updateCallLogDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.callLogsService.delete(id);
  }
}
