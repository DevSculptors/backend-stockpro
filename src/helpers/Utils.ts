import bcrypt from "bcrypt";
import { RolesUser } from "interfaces/User";

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