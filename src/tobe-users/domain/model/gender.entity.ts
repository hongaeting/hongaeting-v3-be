import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class College {
  //
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;
}
