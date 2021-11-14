import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CommonEntity {
  //
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  getId() {
    return this.id;
  }

  getCreatedAt() {
    return this.createdAt.toISOString();
  }

  getUpdatedAt() {
    return this.updatedAt.toISOString();
  }

  getDeletedAt() {
    return this.deletedAt.toISOString();
  }
}
