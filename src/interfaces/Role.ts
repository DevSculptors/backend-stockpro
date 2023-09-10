export interface Role{
    id: string;
    name: string;
    description: string;
}

export type RoleName = Pick<Role, 'name'>;
export type createdRole = Omit<Role, 'id'>;

export interface RolesNames{
    roles: RoleName[]
}

export interface RoleUser{
    id: string
    id_user: string;
    id_role: string;
}

export type createdRoleUser = Omit<RoleUser, 'id'>


