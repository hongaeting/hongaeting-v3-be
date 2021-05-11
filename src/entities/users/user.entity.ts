import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
