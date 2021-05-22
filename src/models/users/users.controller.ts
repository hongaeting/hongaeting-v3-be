import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InternalException } from 'src/util/exception/internal.exception';
import { User } from './user.entity';

const MSG_NO_USER = 'There is no user.';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  async find(@Param('id') id: string) {
    const user: User = await this.usersService.findOne(id);

    if (!user)
      throw new InternalException(MSG_NO_USER);

    return user;
  }

  @Get()
  async findAll() {
    const users: User[] = await this.usersService.findAll();

    if (users.length === 0)
      throw new InternalException(MSG_NO_USER);

    return users;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async modify(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.delete(id);
  }
}
