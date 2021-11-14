import { Column, Entity } from 'typeorm';

import { CommonEntity } from 'src/commons/domain/model/common.entity';

@Entity()
export class Gender extends CommonEntity {
  //
  @Column({ nullable: false, unique: true })
  private readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
