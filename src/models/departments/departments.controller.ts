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
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';
import { Department } from './department.entity';
import { DepartmentsService } from './departments.service';

@Controller('departments')
@UseInterceptors(NotFoundInterceptor)
export class DepartmentsController {
  private readonly logger: Logger = new Logger('DepartmentsController');

  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  async createOne(@Body() payload: CreateDepartmentDto): Promise<InsertResult> {
    await this.validateDepartment(payload.department);
    return this.departmentsService.createOne(payload);
  }

  @Get()
  async findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Department> {
    return this.departmentsService.findById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateDepartmentDto,
  ): Promise<UpdateResult> {
    await this.validateDepartment(payload.department);
    return this.departmentsService.updateById(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<UpdateResult> {
    return this.departmentsService.deleteById(id);
  }

  private async validateDepartment(department: string): Promise<void> {
    if (await this.departmentsService.isDuplicatedDepartment(department))
      throw new HttpException(
        '중복된 학과 분류가 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
  }
}
