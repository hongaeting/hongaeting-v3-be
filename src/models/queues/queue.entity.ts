import { Column, Entity } from 'typeorm';

import { Common } from '../commons/common.entity';

@Entity()
export class Queue extends Common {
  @Column({ nullable: true })
  maleUserId: number;

  @Column({ nullable: true })
  femaleUserId: number;

  @Column({ nullable: false })
  roomId: string;
}
