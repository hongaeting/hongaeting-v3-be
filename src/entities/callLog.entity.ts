import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users/user.entity';

@Entity()
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  caller: User;

  @ManyToOne(() => User)
  callee: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  duration: number;
}
