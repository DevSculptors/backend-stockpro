import { Role, RoleUser, createdRole, createdRoleUser } from "../interfaces/Role";
import { User, CreateUser, UpdateUser, RolesUser, GetUsers } from "../interfaces/User";
import { prisma } from "../helpers/Prisma";



export const getUsers = async (): Promise<GetUsers[]> => {
  const users: GetUsers[] = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      password: false,
      isActive: true,
      email: true,
      personId: true,
    }
  });
  return users;
}

export const createUser = async (user: CreateUser): Promise<User> => {
  const newUser: User = await prisma.user.create({
    data: user
  });
  return newUser;
}

export const getUserById = async (id: string): Promise<User | null> => {
  const user: User | null = await prisma.user.findFirst({
    where: {
      id: id
    }
  });
  return user;
}

export const getRoleById = async (id: string): Promise<Role | null> => {
  const role: Role | null = await prisma.role.findFirst({
    where: {
      id: id
    }
  });
  return role;
}

export const getRoleByName= async(name: string): Promise<Role | null> => {
  const role: Role | null = await prisma.role.findFirst({
    where: {
      name: name
    }
  });
  return role;
}

export const assignRoleToUser = async (role_user: createdRoleUser): Promise<RoleUser> => {
  const assignedRole:RoleUser = await prisma.role_User.create({
    data: role_user
  });
  return assignedRole;
}

export const verifyRoleUser = async (roleUser: createdRoleUser): Promise<RoleUser | null> => {
  const roleFound: RoleUser | null = await prisma.role_User.findFirst({
    where: {
      id_user: roleUser.id_user,
      id_role: roleUser.id_role
    }
  });
  return roleFound;
}

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const user: User | null = await prisma.user.findFirst({
    where: {
      username: username
    }
  });
  return user;
}

export const updateUser = async (id: string, user: UpdateUser): Promise<User | null> => {
  const newUser: User | null = await prisma.user.update({
    where: {
      id: id
    },
    data: user
  });
  return newUser;
}

//{ roles_user: { role: { name: string; }; }[]; }
export const getRoleFromUser = async (id: string): Promise<RolesUser | null> =>{
  const roles: RolesUser = await prisma.user.findUnique({
    where : {id: id},
    select: {
      roles_user: {
        select: {
          role:{
            select: { name:true }
          }
        }
      }
    }, 
  });
  return roles;
}

export const getUserByEmail = async (email:string): Promise<User | null> =>{
  const user: User = await prisma.user.findFirst({
    where: {
      email: email
    }
  });
  return user;
}

export const changeStateOfUser = async (id: string, state: boolean): Promise<any> =>{
  const updatedUser = await prisma.user.update({
    where: {id: id},
    data: {isActive: state}
  });
  return updatedUser;
}

export const createNewRole = async (role: createdRole): Promise<createdRole> =>{
  const newRole = await prisma.role.create({
    data: role
  });
  return newRole;
}

