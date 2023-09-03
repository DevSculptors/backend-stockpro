import { Request, Response } from "express";
import { verifyToken } from "../helpers/Token";
import { EncryptPassword, formatErrorMessage, validateRole, validateSchema } from "../helpers/Utils";
import { UpdateUser, User } from "../interfaces/User";
import { getUsers, updateUser } from "../services/user.services";
import { RoleName } from "../interfaces/Role";
import { Message } from "../helpers/Errors";
import { userSchema } from "../schemas/auth.schema";


export const getAllUsers = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const decodedToken = await decodeToken(req);
        if(!validateRole(decodedToken)){
            return res.status(400).json({message: 'The current user doesnt have permissions'});
        }
        const users: User[] = await getUsers();
        return res.status(200).json(users);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
}

export const updateUserFields = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const decodedToken = await decodeToken(req);
        if(!validateRole(decodedToken)){
            return res.status(400).json({message: 'The current user doesnt have permissions'});
        }
        const { id, username, password, isActive, email, personId } = req.body;
        const partialUser: UpdateUser = {
            username, 
            password, 
            isActive,
            email,
            personId
        }
        const validateUser = await validateSchema(userSchema, partialUser)
        if("error" in validateUser){
            const errorMessages: Array<Message> = validateUser.error.issues;
            const messages = formatErrorMessage(errorMessages)
            return res.status(400).json(messages);
        }
        partialUser.password = await EncryptPassword(password);
        const updatedUser: User = await updateUser(id,partialUser);
        return res.status(200).json({updatedUser}); 
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
}

const decodeToken = async (req: Request): Promise<RoleName[]> =>{
    const { token } = req.cookies;
    const validToken = await verifyToken(token);
    return validToken.roles;
}