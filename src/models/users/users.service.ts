import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { ICreateUser } from './interface/create-user.interface';
import { IUpdateUser } from './interface/update-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  create(userData: ICreateUser) {
    return this.usersRepository.createQueryBuilder()
      .insert()
      .into(User)
      .values([{ ...userData }])
      .execute();
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  update(id: string, userData: IUpdateUser) {
    return this.usersRepository.update(id, userData);
  }

  delete(id: string) {
    return this.usersRepository.delete(id);
  }
}
