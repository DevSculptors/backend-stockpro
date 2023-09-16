import bcrypt from "bcrypt";
import { RolesUser } from "../interfaces/User";
import {z,  ZodError } from "zod";
import { Request, Response } from "express";
import { Message } from "./Errors";
import { RoleName } from "../interfaces/Role";
import { verifyToken } from "./Token";
import  isUUID from 'uuid-validate';
import { Product } from "interfaces/Product";


const ROLE_ADMIN = 'admin';

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

export const validateRole = (role: string) => {
  return role === ROLE_ADMIN;
}

export const decodeToken = async (req: Request): Promise<RoleName[]> =>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    return null;
  }
  const validToken = await verifyToken(token);
  return validToken.role;
}

export const validateUUID = (uuid: string) => {
  return isUUID(uuid);
}

export const castProductSalePrice = (product: Product) =>{
  product.sale_price = Number(product.sale_price);
}