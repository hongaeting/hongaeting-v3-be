import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from '../dto/update-User.Dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async createUser(user: CreateUserDto) {
    return await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([{ ...user }])
      .execute();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUser(id: string, UpdateUserDto: UpdateUserDto) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .update()
      .set(UpdateUserDto)
      .where('id = :id', { id: id })
      .execute();
  }

  async remove(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: id })
      .execute();
  }
}
