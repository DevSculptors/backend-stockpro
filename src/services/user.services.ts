import { User, CreateUser, UpdateUser } from "interfaces/User";

export const getUsers = async (): Promise<User[]> => {
  const users: User[] = await prisma.user.findMany();
  return users;
}

export const createUser = async (user: CreateUser): Promise<User> => {
  const newUser: User = await prisma.user.create({
    data: user
  });
  return newUser;
}

export const getUserById = async (id: number): Promise<User | null> => {
  const user: User | null = await prisma.user.findFirst({
    where: {
      id: id
    }
  });
  return user;
}

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const user: User | null = await prisma.user.findFirst({
    where: {
      username: username
    }
  });
  return user;
}

export const updateUser = async (id: number, user: UpdateUser): Promise<User | null> => {
  const newUser: User | null = await prisma.user.update({
    where: {
      id: id
    },
    data: user
  });
  return newUser;
}

