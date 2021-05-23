import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);

    return true;
  }

  @Patch(':id')
  async modify(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(id, updateUserDto);

    return true;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.delete(id);

    return true;
  }
}
