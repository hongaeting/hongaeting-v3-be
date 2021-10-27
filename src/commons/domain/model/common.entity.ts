import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Common {
  @PrimaryGeneratedColumn()
  protected id: number;

  @CreateDateColumn()
  protected createdAt: Date;

  @UpdateDateColumn()
  protected updatedAt: Date;

  @DeleteDateColumn()
  protected deletedAt: Date;
}
