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

  // 자동 생성을 사용하지 않는 이유: 쿼리의 실행시간이 아닌 사용자의 시간에 맞추어야 한다고 생각하여 client 단의 시간에 맞추도록 한다.
  @Column()
  startedAt: Date;

  @Column({ default: null, nullable: true })
  endedAt?: Date;
}
