import { GenderType } from '../user.entity';

export class UpdateUserDto {
  password: string;
  isVerified: boolean;
}
