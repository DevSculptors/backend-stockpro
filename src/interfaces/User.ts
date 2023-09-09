// import { User } from "@prisma/client";

import { Role } from "@prisma/client";

export interface User  {
  id: string;
  username: string;
  password: string;
  isActive: boolean;
  email: string;
  personId: string;
}

export type CreateUser = Omit<User, "id">;
export type UpdateUser = Partial<CreateUser>;
export type GetUsers = Omit<User, "password">;

export interface GenerateTokenPayload {
  userId: string;
  roles: Pick<Role, 'name'>[]
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
  