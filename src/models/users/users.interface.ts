export interface ICreateUser {
  email: string;
  nickname: string;
  dateOfBirth: string;
  genderId: number;
  departmentId: number;
}

export interface IUpdateUser {
  nickname?: string;
  dateOfBirth?: string;
  genderId?: number;
  departmentId?: number;
}
