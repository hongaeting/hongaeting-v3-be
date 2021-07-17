import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';

import { NotFoundInterceptor } from '../../interceptors/notFound.interceptor';
import { CreateGenderDto, UpdateGenderDto } from './genders.dto';
import { Gender } from './gender.entity';
import { GendersService } from './genders.service';

@Controller('genders')
@UseInterceptors(NotFoundInterceptor)
export class GendersController {
  private readonly logger: Logger = new Logger('GendersController');

  constructor(private readonly gendersService: GendersService) {}

  @Post()
  async createOne(@Body() payload: CreateGenderDto): Promise<InsertResult> {
    await this.validateGender(payload.gender);
    return this.gendersService.createOne(payload);
  }

  @Get()
  async findAll(): Promise<Gender[]> {
    return this.gendersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Gender> {
    return this.gendersService.findById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateGenderDto,
  ): Promise<UpdateResult> {
    await this.validateGender(payload.gender);
    return this.gendersService.updateById(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<UpdateResult> {
    return this.gendersService.deleteById(id);
  }

  private async validateGender(gender: string): Promise<void> {
    if (await this.gendersService.isDuplicatedGender(gender))
      throw new HttpException(
        '중복된 성별 분류가 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
  }
}
