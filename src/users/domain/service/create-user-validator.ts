import { UserRepository } from '../repository/user.repository';

export class CreateUserValidator {
  //
  constructor(private readonly userRepository: UserRepository) {}

  async validateEmail(email) {
    // await ...
    await this.userRepository.findByEmail(email);
  }
}
