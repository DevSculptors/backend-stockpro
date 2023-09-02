// import { User } from "@prisma/client";

import { Role } from "@prisma/client";

export interface User  {
  id: number;
  username: string;
  password: string;
  isActive: boolean;
  personId: number;
}

export type CreateUser = Omit<User, "id">;
export type UpdateUser = Partial<CreateUser>;

export interface GenerateTokenPayload {
  userId: string;
  roles: Pick<Role, 'name'>[]
}

export interface RolesUser {
  roles_user: {
    role: { name: string; 
    }; 
  }[]; 
}
  