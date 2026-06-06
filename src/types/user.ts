export interface User {
  id: string;
  fName: string;
  lName: string;
  email: string;
}

export interface SignupInput {
  fName: string;
  lName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
