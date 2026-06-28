export interface User {
  id: string;
  fName: string;
  lName: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  location: string;
  latitude: number;
  longitude: number;
  countryShortName: string;
}

export interface SignupInput {
  fName: string;
  lName: string;
  email: string;
  password: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
