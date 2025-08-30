import { EGender, ERoles } from "../../models/enum/etype_project.enum";

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phonenumber: string;
  pictureUrl?: string;
  roleId: ERoles;
  roleName: string;
  gender: EGender;
  birthday: Date;
  address: string;
  passwordHash: string;
  createdAt: Date;
}

export interface LoginResponeModel {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}