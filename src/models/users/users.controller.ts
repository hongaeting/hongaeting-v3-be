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
import { CreateUserDto } from './interface/create-user.dto';
import { UpdateUserDto } from './interface/update-User.Dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService
      .createUser(createUserDto)
      .then((res) => res.identifiers[0])
      .catch((e) => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getOneUser(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);

    if (!user)
      throw new HttpException(
        'There is no matching user',
        HttpStatus.BAD_REQUEST,
      );

    return user;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService
      .updateUser(id, updateUserDto)
      .then((res) => {
        if (res.affected == 0) {
          throw new HttpException(
            'There is no matching user',
            HttpStatus.BAD_REQUEST,
          );
        }

        return 'Success to update!';
      })
      .catch((e) => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService
      .deleteOne(id)
      .then((res) => {
        if (res.affected == 0) {
          throw new HttpException(
            'There is no matching user',
            HttpStatus.BAD_REQUEST,
          );
        }

        return 'Success to delete!';
      })
      .catch((e) => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }
}
