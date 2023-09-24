// import { User } from "@prisma/client";

import { Person, Role } from "@prisma/client";
import { RoleName } from "./Role";

export interface User  {
  id: string;
  username: string;
  password: string;
  isActive: boolean;
  email: string;
  personId: string;
  id_role: string;
  roleUser?: string;
}

export type CreateUser = Omit<User, "id">;
export type UpdateUser = Partial<CreateUser>;
export type GetUsers = Omit<User, "password">;
export type GetPersonsId = Pick<User, "personId">;

export interface GenerateTokenPayload {
  userId: string;
  role: string
}

export interface GenerateTokenForget {
  userId: string;
  email: string;
}

export interface RolesUser {
  roles_user: {
    role: { name: string; 
    }; 
  }[]; 
}

export interface UserWithPersonData extends Partial<User> {
  person: {
    id: string;
    id_document: string;
    type_document: string;
    name: string;
    last_name: string;
    phone: string;
  },
  role?: {name: string}
}
  