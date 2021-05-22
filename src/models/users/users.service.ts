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

  async create(userData: ICreateUser): Promise<void> {
    await this.usersRepository.create(userData);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async update(id: string, userData: IUpdateUser): Promise<void> {
    this.usersRepository.update(id, userData);
  }

  async delete(id: string): Promise<void> {
    this.usersRepository.delete(id);
  }
}
