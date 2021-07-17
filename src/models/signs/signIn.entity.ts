import { Column, Entity } from 'typeorm';

import { Common } from '../commons/common.entity';

@Entity()
export class SignIn extends Common {
  @Column({ unique: true, nullable: false })
  authToken: string;

  @Column({ nullable: false })
  email: string;
}
