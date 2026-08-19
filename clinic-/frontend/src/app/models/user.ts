export type UserRole =
  | "patient"
  | "doctor"
  | "receptionist"
  | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}
