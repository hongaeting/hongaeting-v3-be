import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-User.Dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService
      .createUser(createUserDto)
      .then((res) => res.identifiers[0])
      .catch((e) => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Get(':id')
  async getOneUser(@Param('id') id: string) {
    return this.usersService.findOne(id)
      .then((user) => {
        if (!user) throw new HttpException('There is no matching user', HttpStatus.BAD_REQUEST);

        return user;
      });
  }

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto)
      .then((res) => {
        if (res.affected == 0) {
          throw new HttpException('There is no matching user', HttpStatus.BAD_REQUEST)
        }

        return 'Success update!';
      })
      .catch((e) => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id)
      .then((res) => {
        if (res.affected == 0) {
          throw new HttpException('There is no matching user', HttpStatus.BAD_REQUEST);
        }

        return 'Success delete!';
      })
      .catch((e) => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }
}
