import { User } from 'src/models/users/user.entity';

export class CreateCallLogDto {
  caller: User;
  callee: User;
}
