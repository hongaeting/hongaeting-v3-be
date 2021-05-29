import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { User } from './user.entity';
import { ICreateUser } from './interface/create-user.interface';
import { IUpdateUser } from './interface/update-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: ICreateUser) {
    await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([{ ...userData }])
      .execute();
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id: id, deletedAt: IsNull() },
    });
  }

  async update(id: string, userData: IUpdateUser) {
    return await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(userData)
      .where('id = :id AND deletedAt IS NULL', { id: id })
      .execute();
  }

  async delete(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ deletedAt: new Date().toISOString() })
      .where('id = :id AND deletedAt IS NULL', { id: id })
      .execute();
  }
}
