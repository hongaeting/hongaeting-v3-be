import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Common } from '../commons/common.entity';
import { Department } from '../departments/department.entity';
import { Gender } from '../genders/gender.entity';

@Entity()
export class SignUp extends Common {
  @Column({ unique: true, nullable: false })
  authToken: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: false })
  dateOfBirth: Date;

  @ManyToOne(() => Gender, (gender) => gender)
  @JoinColumn({ name: 'genderId' })
  gender: Gender;

  @Column({ nullable: false })
  genderId: number;

  @ManyToOne(() => Department, (department) => department)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: false })
  departmentId: number;
}
