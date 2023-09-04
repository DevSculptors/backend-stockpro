export interface Role{
    id: string;
    name: string;
    description: string;
}

export type RoleName = Pick<Role, 'name'>;


export interface RolesNames{
    roles: RoleName[]
}


