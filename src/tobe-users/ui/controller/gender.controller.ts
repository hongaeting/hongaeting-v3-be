import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { Loggable } from '../../../commons/util/loggable';
import { UserService } from '../../application/service/user.service';
import { SendAuthEmailPayload } from '../payload/send-auth-email.payload';
import { UpdateUserPayload } from '../payload/update-user.payload';
import {
  clearAccessToken,
  decryptAccessToken,
  setAccessToken,
} from '../../../commons/util/auth';

@Controller('tobe-users')
export class UserController extends Loggable {
  //
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  @Post('send-auth-email')
  public async sendAuthEmail(@Body() payload: SendAuthEmailPayload) {
    let userDto = await this.userService.findByEmail(payload.email);
    if (!userDto) {
      userDto = await this.userService.create(payload.email);
    }
    await this.userService.sendAuthEmail(userDto.email);
  }

  @Get('auth-token/:authToken')
  public async authenticateToken(
    @Param('authToken') authToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userDto = await this.userService.getByAuthToken(authToken);
    await setAccessToken(
      { id: userDto.id },
      this.configService.get('JWT_SECRET'),
      res,
    );
    res.status(HttpStatus.NO_CONTENT);
    return { isUpdated: userDto.createdAt !== userDto.updatedAt };
  }

  @Get('sign-out')
  public async signOut(@Res({ passthrough: true }) res: Response) {
    await clearAccessToken(res);
  }

  @Patch(':id')
  public async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() payload: UpdateUserPayload,
  ) {
    await this.checkAuthorizationByAccessTokenAndUserId(req, id);
    await this.userService.update(id, payload);
  }

  @Get(':id')
  public async findById(@Req() req: Request, @Param('id') id: string) {
    await this.checkAuthorizationByAccessTokenAndUserId(req, id);
    return await this.userService.findById(id);
  }

  private async checkAuthorizationByAccessTokenAndUserId(
    req: Request,
    userId: string,
  ) {
    const { id } = (await decryptAccessToken(
      this.configService.get('JWT_SECRET'),
      req,
    )) as jwt.JwtPayload;
    if (userId !== id) {
      throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    }
  }
}
