import { Column, Entity } from 'typeorm';

import { CommonEntity } from 'src/commons/domain/model/common.entity';

@Entity()
export class College extends CommonEntity {
  //
  @Column({ nullable: false, unique: true })
  private value: string;

  getValue() {
    return this.value;
  }
}
