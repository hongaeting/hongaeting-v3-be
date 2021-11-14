import { Column, Entity } from 'typeorm';

import { CommonEntity } from 'src/commons/domain/model/common.entity';

@Entity()
export class Auth extends CommonEntity {
  //
  @Column({ nullable: false, unique: true })
  private readonly email: string;

  @Column({ unique: true })
  private readonly token: string;

  constructor(email: string, token: string) {
    super();
    this.email = email;
    this.token = token;
  }

  getEmail() {
    return this.email;
  }

  getToken() {
    return this.token;
  }
}
