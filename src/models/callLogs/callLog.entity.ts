import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'callerId' })
  caller: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'calleeId' })
  callee: User;

  @Column({ nullable: false })
  startedAt: Date;

  @Column({ nullable: true, default: null })
  endedAt: Date;

  @Column({ nullable: true, default: null })
  deletedAt: Date;
}
