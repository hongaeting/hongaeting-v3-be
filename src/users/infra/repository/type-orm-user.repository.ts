import { EntityRepository, Repository } from 'typeorm';

import { User } from '../../domain/model/user.entity';
import { UserRepository } from '../../domain/repository/user.repository';

@EntityRepository(User)
export class TypeOrmUserRepository
  extends Repository<User>
  implements UserRepository
{
  //
  async findById(id: string): Promise<User | undefined> {
    return await this.findOne(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.findOne({ where: { email } });
  }
}
