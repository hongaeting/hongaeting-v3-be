import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, IsNull, Repository } from 'typeorm';
import { createTransport, Transporter } from 'nodemailer';

import { ISignIn, ISignUp } from './signs.interface';
import { SignUp } from './signUp.entity';
import { SignIn } from './signIn.entity';

@Injectable()
export class SignsService {
  private readonly logger: Logger = new Logger('SignsController');
  private readonly transport: Transporter;

  constructor(
    @InjectRepository(SignUp)
    private readonly signUpRepository: Repository<SignUp>,
    @InjectRepository(SignIn)
    private readonly signInRepository: Repository<SignIn>,
    private readonly config: ConfigService,
  ) {
    this.transport = createTransport({
      host: config.get('SMPT_HOST'),
      port: config.get('SMPT_PORT'),
      secure: true,
      auth: {
        user: config.get('SMPT_USER'),
        pass: config.get('SMPT_PASS'),
      },
    });
  }

  async createSignUpOne(signUpData: ISignUp): Promise<InsertResult> {
    return this.signUpRepository.insert(signUpData);
  }

  async createSignInOne(signInData: ISignIn): Promise<InsertResult> {
    return this.signInRepository.insert(signInData);
  }

  async findSignUpById(id: number): Promise<SignUp> {
    return this.signUpRepository.findOne(id, {
      where: { deletedAt: IsNull() },
    });
  }

  async findSignUpByAuthToken(authToken: string): Promise<SignUp> {
    return this.signUpRepository.findOne({ authToken });
  }

  async findSignInById(id: number): Promise<SignIn> {
    return this.signInRepository.findOne(id, {
      where: { deletedAt: IsNull() },
    });
  }

  async findSignInByAuthToken(authToken: string): Promise<SignIn> {
    return this.signInRepository.findOne({ authToken });
  }

  async sendSignUpEmail(to: string, authToken: string): Promise<any> {
    return this.sendEmail({
      to,
      subject: '홍개팅 회원가입 인증',
      html: `<a href="http://localhost:4000/api/v1/signs/sign-up-auth/${authToken}" target="_blank">회원가입 이메일 본인인증 클릭</a>`,
    });
  }

  async sendSignInEmail(to: string, authToken: string): Promise<any> {
    return this.sendEmail({
      to,
      subject: '홍개팅 로그인 인증',
      html: `<a href="http://localhost:4000/api/v1/signs/sign-in-auth/${authToken}" target="_blank">로그인 이메일 본인인증 클릭</a>`,
    });
  }

  private sendEmail(mailOptions: {
    from?: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.transport.sendMail(
        {
          from: `홍개팅 < ${this.config.get('SMPT_HOST')} >`,
          ...mailOptions,
        },
        (err, info) => {
          if (err) reject(err);
          resolve(info);
        },
      );
    });
  }
}
