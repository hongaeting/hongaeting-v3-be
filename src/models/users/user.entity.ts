import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { CallLog } from '../callLogs/callLog.entity';

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column('enum', { enum: GenderType })
  gender: GenderType;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => CallLog, (callLog) => callLog.caller, {
    onDelete: 'NO ACTION',
  })
  madeCallLog: CallLog[];

  @OneToMany(() => CallLog, (callLog) => callLog.callee, {
    onDelete: 'NO ACTION',
  })
  receivedCallLog: CallLog[];

  @Column({ default: null, nullable: true })
  deletedAt: Date;
}
