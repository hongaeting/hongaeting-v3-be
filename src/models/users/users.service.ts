import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './interface/create-user.dto';
import { UpdateUserDto } from './interface/update-user.Dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  createUser(user: CreateUserDto): Promise<InsertResult> {
    return this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([{ ...user }])
      .execute();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.usersRepository
      .createQueryBuilder('user')
      .update()
      .set(updateUserDto)
      .where('id = :id', { id: id })
      .execute();
  }

  deleteOne(id: number): Promise<DeleteResult> {
    return this.usersRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: id })
      .execute();
  }
}
