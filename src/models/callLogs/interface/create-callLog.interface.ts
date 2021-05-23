import { User } from "src/models/users/user.entity";

export interface ICreateCallLog {
  caller: User;
  callee: User;
  startedAt: Date;
}