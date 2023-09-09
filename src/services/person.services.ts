import { GetPersonsId } from "../interfaces/User";
import {prisma } from "../helpers/Prisma";
import { CreatePerson,UpdatePerson, Person } from "../interfaces/Person";

export const getPersons = async (): Promise<Person[]> => {
  const persons: Person[] = await prisma.person.findMany();
  return persons;
}

export const createPerson = async (person: CreatePerson): Promise<Person> => {
  const newPerson: Person = await prisma.person.create({
    data: person
  });
  return newPerson;
}

export const getPersonById = async (id: string): Promise<Person | null> => {
  const person: Person | null = await prisma.person.findUnique({
    where: {
      id: id
    }
  });
  return person;
}

export const updatePersonById= async (id: string, personData: UpdatePerson): Promise<UpdatePerson | null> =>{
  const updatedPerson: UpdatePerson = await prisma.person.update({
    where: { id:id },
    data: personData
  });
  return updatedPerson;
}

export const getClients = async (): Promise<Person[]> => {
  const usersId: GetPersonsId[] = await prisma.user.findMany({
    select: {
      personId: true
    }
  });
  const clients: Person[] = await prisma.person.findMany({
    where: {
      id: {
        notIn: usersId.map((user) => user.personId)
      }
    }
  });
  return clients;
}

