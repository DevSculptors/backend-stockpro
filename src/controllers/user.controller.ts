import { Request, Response } from "express";
import { EncryptPassword, calculateSkip, simplifyRoles, validateUUID } from "../helpers/Utils";
import { RolesUser, UpdateUser, User, UserWithPersonData } from "../interfaces/User";
import { changeStateOfUser, createNewRole, deleteUserById, getRoleById, getRoleByName, getRoleFromUser, getUserById, getUsers, updateUser } from "../services/user.services";
import { IRoleName, createdRole, createdRoleUser } from "../interfaces/Role";
import { UpdatePerson } from "../interfaces/Person";
import { updatePersonById } from "../services/person.services";


export const getAllUsers = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const users: any[] = await getUsers(calculateSkip(page, limit), limit);
        users.forEach(user => {
            user.role = user.role?.name;
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
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });

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
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });

        const { username, isActive, email, 
            id_document, type_document, name, last_name, phone, roleName } = req.body;
        const userFound = await getUserById(id);
        if(!userFound){
            return res.status(404).json({message: 'User not found'});
        }
        const role = await getRoleByName(roleName);
        if(!role){
            return res.status(404).json({message: 'Role not found'});
        }
        const partialUser: UpdateUser = {
            username,  
            isActive,
            email,
            personId: userFound.person.id,
            id_role: role.id
        };
        const partialPerson: UpdatePerson = {
            id_document: id_document,
            type_document: type_document,
            name: name,
            last_name: last_name,
            phone: phone
        };
        
        const updatedUser: User = await updateUser(id,partialUser);
        const updatedPerson: UpdatePerson = await updatePersonById(partialUser.personId, partialPerson); 
        const userRole: IRoleName = await getRoleFromUser(updatedUser.id);
        return res.status(200).json({updatedUser, updatedPerson, role: userRole?.role.name}); 
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

export const getUserInfoById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });
        
        const userFound: UserWithPersonData = await getUserById(id);
        if(!userFound) return res.status(404).json({message: 'User not found'});
        userFound.roleUser = userFound.role?.name;
        delete userFound.role;
        return res.status(200).json(userFound);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });

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

