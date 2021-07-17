import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult, UpdateResult, IsNull } from 'typeorm';

import { Department } from './department.entity';
import { ICreateDepartment, IUpdateDepartment } from './departments.interface';

@Injectable()
export class DepartmentsService {
  private readonly logger: Logger = new Logger('DepartmentsService');

  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  async createOne(departmentData: ICreateDepartment): Promise<InsertResult> {
    return this.departmentsRepository.insert(departmentData);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentsRepository.find({ deletedAt: IsNull() });
  }

  async findById(id: number): Promise<Department> {
    return this.departmentsRepository.findOne(id, {
      where: { deletedAt: IsNull() },
    });
  }

  async updateById(
    id: number,
    departmentData: IUpdateDepartment,
  ): Promise<UpdateResult> {
    return this.departmentsRepository.update(
      { id, deletedAt: IsNull() },
      departmentData,
    );
  }

  async deleteById(id: number): Promise<UpdateResult> {
    return this.departmentsRepository.update(
      { id, deletedAt: IsNull() },
      { deletedAt: new Date().toISOString() },
    );
  }

  async isDuplicatedDepartment(department: string): Promise<boolean> {
    const [, cnt] = await this.departmentsRepository.findAndCount({
      department,
    });
    return cnt > 0;
  }
}
