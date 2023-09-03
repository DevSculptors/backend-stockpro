import bcrypt from "bcrypt";
import { RolesUser } from "../interfaces/User";
import {z,  ZodError } from "zod";
import { Request, Response } from "express";
import { Message } from "./Errors";
import { RoleName, RolesNames } from "../interfaces/Role";

export const EncryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export const ComparePassword = async (password: string, receivedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, receivedPassword);
}

export const simplifyRoles = (roles: RolesUser) => {
  return roles.roles_user.map((item => item.role));
}

export const validateSchema = async (schema: z.AnyZodObject, data: any): Promise<any> => {
  let result = await schema.safeParseAsync(data)
  if(!result.success)
    return result
  return data
}

export const formatErrorMessage = (messages: Message[]) => {
  const mappedMessages = messages.map((item) => ({message: item.message, path: item.path}));
  return mappedMessages
}

export const validateRole = (roles: RoleName[]) => {
  return roles.some(item => item.name === 'admin')
}