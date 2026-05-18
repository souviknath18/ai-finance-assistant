import { User } from "./user";

export type SignupPayload = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  access: string;
  refresh: string;
  user: User;
};