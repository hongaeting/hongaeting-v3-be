import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from 'src/commons/domain/model/common.entity';
import { College } from './college.entity';
import { Gender } from './gender.entity';

@Entity()
export class User extends CommonEntity {
  //
  @Column({ nullable: false, unique: true })
  private readonly email: string;

  @Column({ unique: true })
  private nickname: string;

  @Column()
  private dateOfBirth: Date;

  @ManyToOne(() => College, (t) => t)
  @JoinColumn({ name: 'collegeId' })
  private college: College;

  @ManyToOne(() => Gender, (t) => t)
  @JoinColumn({ name: 'genderId' })
  private gender: Gender;

  @Column()
  private collegeId: string;

  @Column()
  private genderId: string;

  constructor(email: string) {
    super();
    this.email = email;
  }

  changeProfile(profile: {
    nickname?: string;
    dateOfBirth?: string;
    collegeId?: string;
    genderId?: string;
  }) {
    this.nickname = profile.nickname;
    this.dateOfBirth = new Date(profile.dateOfBirth);
    this.collegeId = profile.collegeId;
    this.genderId = profile.genderId;
  }

  getEmail() {
    return this.email;
  }

  getNickname() {
    return this.nickname;
  }

  getDateOfBirth() {
    return this.dateOfBirth.toISOString();
  }

  getCollege() {
    return this.college.getValue();
  }

  getGender() {
    return this.gender.getValue();
  }
}
