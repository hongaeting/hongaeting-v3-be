export class ISignUp {
  authToken: string;
  email: string;
  nickname: string;
  dateOfBirth: string;
  genderId: number;
  departmentId: number;
}

export class ISignIn {
  authToken: string;
  email: string;
}
