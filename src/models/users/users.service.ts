import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { ICreateUser } from './interface/create-user.interface';
import { IUpdateUser } from './interface/update-user.interface';
import { InternalException } from 'src/util/exception/internal.exception';

const MSG_NO_USER = 'There is no user.';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(userData: ICreateUser) {
    await this.usersRepository.createQueryBuilder()
      .insert()
      .into(User)
      .values([{ ...userData }])
      .execute();
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();

    if (users.length === 0) throw new InternalException(MSG_NO_USER);

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) throw new InternalException(MSG_NO_USER);

    return user;
  }

  async update(id: string, userData: IUpdateUser) {
    const updateUserResult = await this.usersRepository.update(id, userData);

    if (updateUserResult.affected === 0) throw new InternalException(MSG_NO_USER);
  }

  async delete(id: string) {
    const deleteUserResult = await this.usersRepository.delete(id);

    if (deleteUserResult.affected === 0) throw new InternalException(MSG_NO_USER);
  }
}
