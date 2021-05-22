import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  find(@Param('id') id: string) {
    this.usersService.findOne(id);
  }

  @Get()
  findAll() {
    this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }

  @Patch(':id')
  modify(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.usersService.delete(id);
  }
}
