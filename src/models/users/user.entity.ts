import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { Common } from '../commons/common.entity';
import { Gender } from '../genders/gender.entity';
import { Department } from '../departments/department.entity';

@Entity()
export class User extends Common {
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: false })
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
