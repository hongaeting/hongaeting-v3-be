import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult, UpdateResult, IsNull } from 'typeorm';

import { Gender } from './gender.entity';
import { ICreateGender, IUpdateGender } from './genders.interface';

@Injectable()
export class GendersService {
  private readonly logger: Logger = new Logger('GendersService');

  constructor(
    @InjectRepository(Gender)
    private readonly gendersRepository: Repository<Gender>,
  ) {}

  async createOne(genderData: ICreateGender): Promise<InsertResult> {
    return this.gendersRepository.insert(genderData);
  }

  async findAll(): Promise<Gender[]> {
    return this.gendersRepository.find({ deletedAt: IsNull() });
  }

  async findById(id: number): Promise<Gender> {
    return this.gendersRepository.findOne(id, {
      where: { deletedAt: IsNull() },
    });
  }

  async updateById(
    id: number,
    genderData: IUpdateGender,
  ): Promise<UpdateResult> {
    return this.gendersRepository.update(
      { id, deletedAt: IsNull() },
      genderData,
    );
  }

  async deleteById(id: number): Promise<UpdateResult> {
    return this.gendersRepository.update(
      { id, deletedAt: IsNull() },
      { deletedAt: new Date().toISOString() },
    );
  }

  async isDuplicatedGender(gender: string): Promise<boolean> {
    const [, cnt] = await this.gendersRepository.findAndCount({ gender });
    return cnt > 0;
  }
}
