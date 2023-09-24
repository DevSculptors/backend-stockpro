import { prisma } from "../helpers/Prisma";

import { Role, createdRole, updatedRole } from "../interfaces/Role";


export const getRoles = async (): Promise<Role[]> => {
    const roles: Role[] = await prisma.role.findMany();
    return roles;
}

export const getRoleById = async (id: string): Promise<Role | null> => {
    const role: Role | null = await prisma.role.findFirst({
        where: {
            id: id
        }
    });
    return role;
}

export const createNewRole = async (role: createdRole): Promise<Role> => {
    const newRole: Role = await prisma.role.create({
        data: role
    });
    return newRole;
}

export const deleteOneRole = async (id: string): Promise<Role> => {
    const role: Role = await prisma.role.delete({
        where: {
            id: id
        }
    });
    return role;
}

export const updateOneRole = async (id: string, role: updatedRole): Promise<Role> => {
    const roleUpdated: Role = await prisma.role.update({
        where: {
            id: id
        },
        data: role
    });
    return roleUpdated;
}