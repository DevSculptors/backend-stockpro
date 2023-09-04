import { Request, Response } from "express";
import { verifyToken } from "../helpers/Token";
import { EncryptPassword, decodeToken, formatErrorMessage, validateRole, validateSchema } from "../helpers/Utils";
import { UpdateUser, User } from "../interfaces/User";
import { changeStateOfUser, getUserById, getUsers, updateUser } from "../services/user.services";
import { RoleName } from "../interfaces/Role";
import { Message } from "../helpers/Errors";
import { userSchemaForUpdate } from "../schemas/auth.schema";


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
        const { id, username, isActive, email, personId } = req.body;
        const partialUser: UpdateUser = {
            username,  
            isActive,
            email,
            personId
        }
        const validateUser = await validateSchema(userSchemaForUpdate, partialUser)
        if("error" in validateUser){
            const errorMessages: Array<Message> = validateUser.error.issues;
            const messages = formatErrorMessage(errorMessages)
            return res.status(400).json(messages);
        }
        const updatedUser: User = await updateUser(id,partialUser);
        return res.status(200).json({updatedUser}); 
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
}

export const changeStateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const decodedToken = await decodeToken(req);
        if(!validateRole(decodedToken)){
            return res.status(400).json({message: 'The current user doesnt have permissions'});
        }
        const id  = parseInt(req.params.id); 
        const user: User = await getUserById(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const updatedUser: UpdateUser = await changeStateOfUser(id, !user.isActive);
        return res.status(200).json({isACtive: updatedUser.isActive});
    } catch (error) {
        console.log(error);
        res.send(500).json({message: error.message})
    }
}

