import bcrypt from "bcrypt";
import { RolesUser } from "../interfaces/User";
import {z,  ZodError } from "zod";
import { Request, Response } from "express";
import { Message } from "./Errors";
import { RoleName } from "../interfaces/Role";
import { verifyToken } from "./Token";
import  isUUID from 'uuid-validate';
import { Product } from "../interfaces/Product";
import { ValueOfDay } from "../interfaces/Sale";


const ROLE_ADMIN = 'admin';
const ROLE_CASHIER = 'cashier';

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
  return role === ROLE_ADMIN || role === ROLE_CASHIER;
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

export const calculateSkip = (page: number, limit: number) =>{
  const skip = (page-1)*limit;
  return skip < 0 ? 0 : skip;
}

export const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export const chartData: ValueOfDay[] = weekday.map((day) => {
  return {
      day: day,
      value: 0
  }
});

export const getLastSundaySaturdayDates = () => {
  const currentDate = new Date();
  let sundayDate = new Date(currentDate)
  sundayDate.setDate(currentDate.getDate() - currentDate.getUTCDay());
  sundayDate.setDate(sundayDate.getDate() - 7);
  sundayDate.setUTCHours(0,0,0,0);
  let saturdayDate = new Date(currentDate);
  saturdayDate.setDate(currentDate.getDate() - currentDate.getUTCDay());
  saturdayDate.setDate(saturdayDate.getDate() - 1);
  saturdayDate.setUTCHours(0,0,0,0);
  return {sundayDate, saturdayDate};
}

export type CategoryAmount = {category: string, amount: number};

export type ValuesOfDay = {day: string, values: CategoryAmount[]};

export type CategoriesPerDay = ValuesOfDay[];

export const fillCategoriesPerDay = () => {
  const categoriesPerDay: CategoriesPerDay = weekday.map((day) => {
    return {
        day: day,
        values: []
    }
  });
  return categoriesPerDay;
}