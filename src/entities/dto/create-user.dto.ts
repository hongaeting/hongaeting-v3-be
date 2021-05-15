import { GenderType } from '../users/user.entity';

export class CreateUserDto {
  email: string;
  password: string;
  gender: GenderType;
}
