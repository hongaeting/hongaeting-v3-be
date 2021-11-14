import { Gender } from '../model/gender.entity';

export interface GenderRepository {
  //
  save(gender: Gender): Promise<Gender>;

  find(): Promise<Gender[]>;
}
