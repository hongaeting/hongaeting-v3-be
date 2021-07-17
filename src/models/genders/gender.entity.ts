import { Column, Entity } from 'typeorm';

import { Common } from '../commons/common.entity';

@Entity()
export class Gender extends Common {
  @Column({ unique: true, nullable: false })
  gender: string;
}
