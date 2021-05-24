import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  caller: User;

  @ManyToOne(() => User, (user) => user.id)
  callee: User;

  @Column()
  startedAt: Date;

  @Column({ default: null, nullable: true })
  endedAt: Date;
}
