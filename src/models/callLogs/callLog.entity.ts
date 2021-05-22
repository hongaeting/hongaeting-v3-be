import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  caller: User;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  callee: User;

  @Column()
  startAt: Date;

  @Column({ default: null, nullable: true })
  endedAt?: Date;
}
