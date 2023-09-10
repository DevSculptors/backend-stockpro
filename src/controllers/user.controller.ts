import { Request, Response } from "express";
import { EncryptPassword, simplifyRoles } from "../helpers/Utils";
import { RolesUser, UpdateUser, User, UserWithPersonData } from "../interfaces/User";
import { assignRoleToUser, changeStateOfUser, createNewRole, deleteUserById, getRoleById, getRoleByName, getRoleFromUser, getUserById, getUsers, updateUser, verifyRoleUser } from "../services/user.services";
import { createdRole, createdRoleUser } from "../interfaces/Role";
import { UpdatePerson } from "../interfaces/Person";
import { updatePersonById } from "../services/person.services";


export const getAllUsers = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const users: any[] = await getUsers();
        users.forEach(user => {
            user.roles_user = simplifyRoles(user);
        });
        return res.status(200).json(users);
    } catch (err) {
        console.log("Error:", err.message);
        return res.status(500).json({ message: err.message });
    }
}

export const changeState = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const { id, isActive } = req.body;
        const userFound = await getUserById(id);
        if(!userFound) return res.status(404).json({message: 'User not found'});
        const state = await changeStateOfUser(id, Boolean(isActive));
        return res.status(201).json({isActive: state.isActive});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const updateUserFields = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const id = req.params.id;
        const { username, isActive, email, password, 
            id_document, type_document, name, last_name, phone, roleName } = req.body;
        const userFound = await getUserById(id);
        if(!userFound){
            return res.status(404).json({message: 'User not found'});
        }
        const partialUser: UpdateUser = {
            username,  
            isActive,
            email,
            personId: userFound.person.id,
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
        
        const updatedUser: User = await updateUser(id,partialUser);
        const updatedPerson: UpdatePerson = await updatePersonById(partialUser.personId, partialPerson); 
        const roles: RolesUser = await getRoleFromUser(updatedUser.id);
        const listOfRoles = simplifyRoles(roles);
        return res.status(201).json({updatedUser, updatedPerson, listOfRoles}); 
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
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

export const getUserInfoById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userFound: any = await getUserById(id);
        if(!userFound){
            return res.status(404).json({message: 'User not found'});
        }
        userFound.roles_user = simplifyRoles(userFound);
        return res.status(200).json(userFound);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const userFound = await getUserById(id);
        if(!userFound){
            return res.status(404).json({message: 'User not found'});
        }
        const userDeleted = await deleteUserById(id);
        return res.status(200).json(userDeleted);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

