import { Request, Response } from "express";
import { GenerateToken } from "../helpers/Token";
import { EncryptPassword , ComparePassword, simplifyRoles, validateSchema, formatErrorMessage} from "../helpers/Utils";
import { CreateUser , User, GenerateTokenPayload, RolesUser} from "../interfaces/User";
import { getUserByUsername, createUser, getRoleFromUser, getUserByEmail } from "../services/user.services";
import { userSchema } from "../schemas/auth.schema";
import { Message } from "../helpers/Errors";

export const register = async (req: Request, res: Response): Promise<Response> => {
  try{
    const {username, password, isActive, email, personId} = req.body;
    const usernameFound: User = await getUserByUsername(username);
    const userEmailFound: User = await getUserByEmail(email);
    if(usernameFound || userEmailFound){
      return res.status(400).json({message: "The username or email already exists"});
    }
    const passwordHash = await EncryptPassword(password);
    
    const newUser: CreateUser = {
      username,
      password,
      isActive,
      email,
      personId
    };
    const validateUser = await validateSchema(userSchema, newUser)
    if("error" in validateUser){
      const errorMessages: Array<Message> = validateUser.error.issues;
      const messages = formatErrorMessage(errorMessages)
      return res.status(400).json(messages);
    }
    newUser.password = passwordHash;
    const userSaved:User = await createUser(newUser);
    const roles: RolesUser = await getRoleFromUser(userSaved.id);
    const listOfRoles = simplifyRoles(roles)
    const token = await GenerateToken({userId: userSaved.id.toString(), roles: listOfRoles} as GenerateTokenPayload);
    res.cookie("token", token);
    return res.status(201).json(userSaved);
  }catch(err){
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const userFound: User = await getUserByEmail(email);
    if (!userFound) {
      return res.status(400).json({ message: "The username does not exists" });
    }
    const isMatch: boolean = await ComparePassword(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "The password is invalid" });
    }
    const roles: RolesUser = await getRoleFromUser(userFound.id);
    const listOfRoles = simplifyRoles(roles)
    const token = await GenerateToken({userId: userFound.id.toString(), roles: listOfRoles} as GenerateTokenPayload); //Cambiar el rol uwu
    res.cookie("token", token);
    return res.status(200).json(userFound);
  }catch(err){
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
}

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try{
    res.clearCookie("token");
    return res.status(200).json({message: "Logout successfully"});
  }catch(err){
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
}

export const verifyToken = async (req: Request, res: Response): Promise<Response> => {
  try{
    const { token } = req.cookies;
    // Logica aspera uwu
    if(!token){
      return res.status(401).json({message: "Unauthorized"});

    }

  }catch(err){
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
}