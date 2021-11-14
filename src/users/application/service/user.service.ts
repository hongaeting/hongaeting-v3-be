import { Inject, Injectable } from '@nestjs/common';

import { Loggable } from '../../../commons/util/loggable';
import { UserRepository } from '../../domain/repository/user.repository';
import { UserDto } from '../dto/user.dto';
import { User } from '../../domain/model/user.entity';
import { CreateUserValidator } from '../../domain/service/create-user-validator';

@Injectable()
export class UserService extends Loggable {
  //
  private readonly createUserValidator: CreateUserValidator;

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
  ) /**
   *  커스터마이징 레포지토리 주입 방법
   *  1. https://stackoverflow.com/questions/63988821/nestjs-inject-custom-typeorm-repository-based-on-an-interface
   *  2. https://stackoverflow.com/questions/63902613/inject-class-implementation-into-abstract-controller-implementation-based-on-an/63904194#63904194
   *
   *  근데, 2번 항목의 답변 내용을 참고하면, 네스트가 DI를 해주는 구간은
   *  타입이 유효한 트랜스파일링 단계가 아니라,
   *  트랜스파일링 결과물인 JS 코드의 런타임 단계이기 때문에,
   *  잘못된 타입의 클래스 주입이 런타입 에러를 발생할 수 있을 것 같아서 테스트가 필요하다.
   */ {
    super();
    this.createUserValidator = new CreateUserValidator(userRepository);
  }

  public async create(email: string): Promise<UserDto> {
    // const user = new User(email);
    const user = await User.create(email, this.createUserValidator);

    await this.userRepository.save(user);
    return { id: user.getId(), email: user.getEmail() };
  }

  public async findByEmail(email: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.findByEmail(email);
    return user ? { id: user.getId(), email: user.getEmail() } : undefined;
  }

  public async findById(id: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.findById(id);
    return user
      ? {
          id: user.getId(),
          email: user.getEmail(),
          nickname: user.getNickname(),
          dateOfBirth: user.getDateOfBirth(),
          college: user.getCollege(),
          gender: user.getGender(),
        }
      : undefined;
  }

  public async update(id: string, userDto: UserDto): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('일치하는 대상이 없습니다.');
    }
    user.changeProfile(userDto);
    await this.userRepository.save(user);
  }

  async sendAuthEmail(email: string) {
    //
  }

  async getByAuthToken(authToken: string): Promise<UserDto> {
    //
    return null;
  }
}
