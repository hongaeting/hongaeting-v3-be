import { Column, Entity } from 'typeorm';

import { Common } from '../commons/common.entity';

@Entity()
export class Department extends Common {
  @Column({ unique: true, nullable: false })
  department: string;
}
