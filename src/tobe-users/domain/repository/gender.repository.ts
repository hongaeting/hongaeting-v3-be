import { User } from '../model/user.entity';

export interface UserRepository {
  //
  save(user: User): Promise<User>;

  findById(id: string): Promise<User | undefined>;

  findByEmail(email: string): Promise<User | undefined>;
}
