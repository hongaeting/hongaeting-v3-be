import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, InsertResult, UpdateResult } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { User } from './user.entity';
import { ICreateUser, IUpdateUser } from './users.interface';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async createOne(userData: ICreateUser): Promise<InsertResult> {
    return this.usersRepository.insert(userData);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.gender', 'gender', 'gender.deletedAt IS NULL')
      .leftJoinAndSelect(
        'user.department',
        'department',
        'department.deletedAt IS NULL',
      )
      .where({ deletedAt: IsNull() })
      .getMany();
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne(id, {
      where: { deletedAt: IsNull() },
      relations: ['gender', 'department'],
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email, deletedAt: IsNull() },
      relations: ['gender', 'department'],
    });
  }

  async findByNickname(nickname: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { nickname, deletedAt: IsNull() },
      relations: ['gender', 'department'],
    });
  }

  async updateById(id: number, userData: IUpdateUser): Promise<UpdateResult> {
    return this.usersRepository.update({ id, deletedAt: IsNull() }, userData);
  }

  async deleteById(id: number) {
    return this.usersRepository.update(
      { id, deletedAt: IsNull() },
      { deletedAt: new Date().toISOString() },
    );
  }

  async isExistEmail(email: string): Promise<boolean> {
    return !!(await this.usersRepository.findOne({ email }));
  }

  async isExistNickname(nickname: string): Promise<boolean> {
    return !!(await this.usersRepository.findOne({ nickname }));
  }

  async generateAccessTokenById(userId: number): Promise<string> {
    const user = await this.findById(userId);
    return this.generateAccessToken(user);
  }

  async generateAccessTokenByEmail(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    return this.generateAccessToken(user);
  }

  async generateAccessToken(user: User): Promise<string> {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      this.config.get('JWT_SECRET'),
      { expiresIn: '3d' },
    );
  }

  async getUserByAccessToken(accessToken: string): Promise<User> {
    try {
      const { id } = jwt.verify(
        accessToken,
        this.config.get('JWT_SECRET'),
      ) as jwt.JwtPayload;
      return this.findById(id);
    } catch {
      return null;
    }
  }
}
