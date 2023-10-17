import { IRoleName, Role, RoleName, RoleUser, createdRole, createdRoleUser } from "../interfaces/Role";
import { User, CreateUser, UpdateUser, RolesUser, GetUsers, UserWithPersonData } from "../interfaces/User";
import { prisma } from "../helpers/Prisma";



export const getUsers = async (skip: number, limit: number): Promise<UserWithPersonData[]> => {
  const users: UserWithPersonData[] = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      password: false,
      personId: false,
      email: true,
      isActive: true,
      person: true,
      role: {
        select: {
          name: true
        }
      }
    },
    skip: skip,
    // take: limit,
    orderBy: {
      username: "asc"
    }
  });
  return users;
}

export const createUser = async (user: CreateUser): Promise<UserWithPersonData> => {
  const newUser: UserWithPersonData = await prisma.user.create({
    data: user,
      select: {
        id: true,
        username: true,
        password: false,
        personId: true,
        email: true,
        isActive: true,
        person: true,
        role: true
      }
  });
  return newUser;
}

export const getUserById = async (id: string): Promise<UserWithPersonData | null> => {
  const user: UserWithPersonData | null = await prisma.user.findFirst({
    where: {
      id: id
    },
    select: {
      id: true,
      username: true,
      password: false,
      personId: false,
      email: true,
      isActive: true,
      person: true,
      role: true,
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

// { role: { name: string; }; 
export const getRoleFromUser = async (id: string): Promise<IRoleName | null> =>{
  const roles: IRoleName = await prisma.user.findUnique({
    where : {id: id},
    select: {
      role:{
        select: {
          name: true
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

export const getUserInfoByEmail = async (email:string): Promise<UserWithPersonData | null> =>{
  const user: UserWithPersonData = await prisma.user.findFirst({
    where: {
      email: email
    },
    select: {
      id: true,
      username: true,
      password: true,
      personId: true,
      email: true,
      isActive: true,
      person: true,
      role: true,
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

export const deleteUserById = async (id: string): Promise<any> =>{
  const deletedUser = await prisma.user.delete({
    where: {id: id}
  });
  return deletedUser;
}

