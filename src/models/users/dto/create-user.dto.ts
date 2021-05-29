import { GenderType } from '../user.entity';

export class CreateUserDto {
  email: string;
  password: string;
  gender: GenderType;
}
