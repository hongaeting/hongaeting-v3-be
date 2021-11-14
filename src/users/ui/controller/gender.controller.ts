import { Body, Controller, Get, Post } from '@nestjs/common';

import { Loggable } from '../../../commons/util/loggable';
import { CreateGenderPayload } from '../payload/create-gender.payload';
import { GenderService } from '../../application/service/gender.service';

@Controller('genders')
export class GenderController extends Loggable {
  //
  constructor(private readonly genderService: GenderService) {
    super();
  }

  @Post()
  public async create(@Body() payload: CreateGenderPayload) {
    return this.genderService.create(payload);
  }

  @Get()
  public async findAll() {
    return this.genderService.findAll();
  }
}
