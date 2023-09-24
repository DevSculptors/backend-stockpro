import { Request, Response } from "express";
import { Role, createdRole, updatedRole } from "../interfaces/Role";
import { createNewRole, deleteOneRole, getRoleById, getRoles, updateOneRole } from "../services/role.services";
import { validateUUID } from "../helpers/Utils";

export const getAllRoles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const roles: Role[] = await getRoles();
        return res.status(200).json(roles);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const getRoleInfoById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });   
        const role: Role = await getRoleById(id);
        if(!role) return res.status(404).json({ message: "Role not found" });
        return res.status(200).json(role);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const createRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, description } = req.body;
        const newRole: createdRole = {
            name, description
        };
        const role: Role = await createNewRole(newRole);
        return res.status(200).json(role);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const deleteRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });   
        const role: Role = await getRoleById(id);
        if(!role) return res.status(404).json({ message: "Role not found" });
        await deleteOneRole(id);   
        return res.status(204).json({ message: "Role deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const updateRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });   
        const role: Role = await getRoleById(id);
        if(!role) return res.status(404).json({ message: "Role not found" });
        const { name, description } = req.body;
        const newRole: updatedRole = {
            name, description
        };
        const roleUpdated: Role = await updateOneRole(id, newRole);
        return res.status(200).json(roleUpdated);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}