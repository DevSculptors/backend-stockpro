import { Request, Response } from "express";
import { verifyToken } from "../helpers/Token";
import { EncryptPassword, decodeToken, formatErrorMessage, simplifyRoles, validateRole, validateSchema } from "../helpers/Utils";
import { GetUsers, RolesUser, UpdateUser, User } from "../interfaces/User";
import { assignRoleToUser, changeStateOfUser, createNewRole, getRoleById, getRoleByName, getRoleFromUser, getUserById, getUsers, updateUser, verifyRoleUser } from "../services/user.services";
import { Role, RoleName, RoleUser, RolesNames, createdRole, createdRoleUser } from "../interfaces/Role";
import { Message } from "../helpers/Errors";
import { userSchemaForUpdate } from "../schemas/auth.schema";
import { Person, UpdatePerson } from "../interfaces/Person";
import { updatePersonById } from "../services/person.services";


export const getAllUsers = async (req: Request, res: Response): Promise<Response> =>{
    try {
        // const decodedToken = await decodeToken(req);
        // if(!validateRole(decodedToken)){
        //     return res.status(400).json({message: 'The current user doesnt have permissions'});
        // }
        const users: GetUsers[] = await getUsers();
        return res.status(200).json(users);
    } catch (err) {
        console.log("Error:", err.message);
        return res.status(500).json({ message: err.message });
    }
}

export const updateUserFields = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const { id, username, isActive, email, password, personId, 
            id_document, type_document, name, last_name, phone, roleName } = req.body;
        const partialUser: UpdateUser = {
            username,  
            isActive,
            email,
            personId,
            password: await EncryptPassword(password)
        };
        const partialPerson: UpdatePerson = {
            id_document: id_document,
            type_document: type_document,
            name: name,
            last_name: last_name,
            phone: phone
        };
        const role = await getRoleByName(roleName);
        if(!role){
            return res.status(404).json({message: 'Role not found'});
        }
        const roleUser: createdRoleUser = {
            id_user: id,
            id_role: role.id
        }
        const roleFound = await verifyRoleUser(roleUser);
        if(!roleFound){
            await assignRoleToUser(roleUser);   
        }
        const validateUser = await validateSchema(userSchemaForUpdate, partialUser)
        if("error" in validateUser){
            const errorMessages: Array<Message> = validateUser.error.issues;
            const messages = formatErrorMessage(errorMessages)
            return res.status(400).json(messages);
        }
        const updatedUser: User = await updateUser(id,partialUser);
        const updatedPerson: UpdatePerson = await updatePersonById(personId, partialPerson); 
        const roles: RolesUser = await getRoleFromUser(updatedUser.id);
        const listOfRoles = simplifyRoles(roles);
        return res.status(200).json({updatedUser, updatedPerson, listOfRoles}); 
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
}

export const changeStateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id  = req.params.id; 
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

export const createRole =async (req:Request, res:Response): Promise<Response> => {
    try {
        const {name, description} = req.body;
        const newRole: createdRole = {
            name, description
        }
        const role = await createNewRole(newRole);
        return res.status(200).json({role});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const assignRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id_user, id_role } = req.body;
        const userFound = await getUserById(id_user);
        const roleFound = await getRoleById(id_role);
        if(!userFound || !roleFound){
            return res.status(404).json({message:"user or role not found"});
        }
        const roleUser: createdRoleUser = {
            id_user,
            id_role
        }
        const assignedRole = await assignRoleToUser(roleUser);
        return res.status(200).json({assignedRole});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})
    }
}

