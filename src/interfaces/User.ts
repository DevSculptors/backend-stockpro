// import { User } from "@prisma/client";

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
  rol: string;
}