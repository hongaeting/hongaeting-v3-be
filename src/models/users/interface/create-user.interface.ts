import { GenderType } from "../user.entity";

export interface ICreateUser {
  email: string;
  password: string;
  gender: GenderType;
}
