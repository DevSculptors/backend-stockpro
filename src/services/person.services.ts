import {prisma } from "../helpers/Prisma";
import { CreatePerson,UpdatePerson, Person } from "interfaces/Person";

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

export const getPersonById = async (id: number): Promise<Person | null> => {
  const person: Person | null = await prisma.person.findUnique({
    where: {
      id: id
    }
  });
  return person;
}

