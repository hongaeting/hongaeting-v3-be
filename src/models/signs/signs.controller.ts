import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { InsertResult } from 'typeorm';
import { nanoid } from 'nanoid';

import { UsersService } from '../users/users.service';
import { SignsService } from './signs.service';
import { SignInDto, SignUpDto } from './signs.dto';

@Controller('signs')
export class SignsController {
  private readonly logger: Logger = new Logger('SignsController');

  constructor(
    private readonly signsService: SignsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.validateEmailDuplicated(signUpDto.email);
    await this.validateNicknameDuplicated(signUpDto.nickname);

    const {
      identifiers: [{ id }],
    } = await this.saveSignUpInfo(signUpDto);
    const signUp = await this.signsService.findSignUpById(id);

    try {
      await this.signsService.sendSignUpEmail(signUp.email, signUp.authToken);
    } catch {
      throw new HttpException(
        '회원가입 인증 이메일 송신 간 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sign-up-auth/:authToken')
  async authenticateSignUp(
    @Param('authToken') authToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const signUp = await this.signsService.findSignUpByAuthToken(authToken);

    if (!signUp)
      throw new HttpException(
        '유효하지 않은 인증 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    await this.validateAuthTokenExpired(signUp.createdAt);
    await this.validateEmailDuplicated(signUp.email);

    const {
      identifiers: [{ id }],
    } = await this.usersService.createOne({
      email: signUp.email,
      nickname: signUp.nickname,
      dateOfBirth: signUp.dateOfBirth.toISOString(),
      genderId: signUp.genderId,
      departmentId: signUp.genderId,
    });

    const accessToken = await this.usersService.generateAccessTokenById(id);
    this.setAccessTokenCookie(accessToken, res);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<void> {
    await this.validateEmailSignedUp(signInDto.email);

    const {
      identifiers: [{ id }],
    } = await this.saveSignInInfo(signInDto);
    const signIn = await this.signsService.findSignInById(id);

    try {
      await this.signsService.sendSignInEmail(signIn.email, signIn.authToken);
    } catch {
      throw new HttpException(
        '로그인 인증 이메일 송신 간 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sign-in-auth/:authToken')
  async authenticateSignIn(
    @Param('authToken') authToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const signIn = await this.signsService.findSignInByAuthToken(authToken);

    if (!signIn) {
      throw new HttpException(
        '유효하지 않은 인증 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.validateAuthTokenExpired(signIn.createdAt);

    const accessToken = await this.usersService.generateAccessTokenByEmail(
      signIn.email,
    );
    this.setAccessTokenCookie(accessToken, res);
  }

  @Post('sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('AccessToken').status(HttpStatus.NO_CONTENT);
  }

  private async validateNicknameDuplicated(nickname: string): Promise<void> {
    if (await this.usersService.isExistNickname(nickname))
      throw new HttpException('중복된 닉네임 입니다.', HttpStatus.BAD_REQUEST);
  }

  private async validateEmailDuplicated(email: string): Promise<void> {
    if (await this.usersService.isExistEmail(email))
      throw new HttpException(
        '이미 가입된 이메일 입니다.',
        HttpStatus.BAD_REQUEST,
      );
  }

  private async validateAuthTokenExpired(createdAt: Date): Promise<void> {
    const standardTime = 1000 * 60 * 60 * 24;
    if (!createdAt || Date.now() - createdAt.getTime() > standardTime) {
      throw new HttpException(
        '유효 기간이 만료 되었습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validateEmailSignedUp(email: string) {
    if (!(await this.usersService.isExistEmail(email))) {
      throw new HttpException(
        '가입되지 않은 이메일 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async saveSignUpInfo(signUpDto: SignUpDto): Promise<InsertResult> {
    const insertResult = await this.signsService.createSignUpOne({
      authToken: nanoid(),
      ...signUpDto,
    });
    if (!insertResult?.raw?.affectedRows)
      throw new HttpException(
        '계정 생성 간 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return insertResult;
  }

  private async saveSignInInfo(signInDto: SignInDto): Promise<InsertResult> {
    const insertResult = await this.signsService.createSignInOne({
      authToken: nanoid(),
      ...signInDto,
    });
    if (!insertResult?.raw?.affectedRows)
      throw new HttpException(
        '로그인 인증 요청 간 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return insertResult;
  }

  private setAccessTokenCookie(accessToken: string, response: Response): void {
    const expireDay = 3;
    response.cookie('AccessToken', accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * expireDay,
      httpOnly: true,
    });
  }
}
