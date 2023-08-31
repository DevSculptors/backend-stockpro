import { Request, Response } from "express";
import { CreatePerson, Person } from "../interfaces/Person"; 

import { getPersons , createPerson} from "../services/person.services";

export const getPersonsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const persons: Person[] = await getPersons();
    return res.status(200).json(persons);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const createPersonController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try{
    const { id_document, type_document, name, last_name, phone, email } = req.body;
    if (!id_document || !type_document || !name || !last_name || !phone || !email) {
      return res.status(400).json({ message: "Please. Send all fields" });
    }

    const newPerson: CreatePerson = {
      id_document,
      type_document,
      name,
      last_name,
      phone,
      email
    };
    const person: Person = await createPerson(newPerson);
    return res.status(201).json(person);
  }catch(err){
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
}




