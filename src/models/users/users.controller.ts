import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { NotFoundInterceptor } from 'src/interceptors/notFound.interceptor';
import { UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(NotFoundInterceptor)
export class UsersController {
  private readonly logger: Logger = new Logger('UsersController');

  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('nickname/:nickname')
  async findByNickname(@Param('nickname') nickname: string) {
    return this.usersService.findByNickname(nickname);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { nickname } = updateUserDto;
    nickname && this.validateNickname(nickname);
    return this.usersService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.deleteById(id);
  }

  private async validateNickname(nickname: string): Promise<void> {
    if (await this.usersService.isExistNickname(nickname))
      throw new HttpException('중복된 닉네임 입니다.', HttpStatus.BAD_REQUEST);
  }
}
