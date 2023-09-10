import { Request, Response } from "express";
import { CreatePerson, Person, UpdatePerson } from "../interfaces/Person"; 

import { getPersons , createPerson, updatePersonById, getPersonById, getClients} from "../services/person.services";
import { decodeToken, formatErrorMessage, validateRole, validateSchema } from "../helpers/Utils";
import { Message } from "../helpers/Errors";
import { personSchema } from "../schemas/person.schema";

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
    const { id_document, type_document, name, last_name, phone } = req.body;
    if (!id_document || !type_document || !name || !last_name || !phone) {
      return res.status(400).json({ message: "Please. Send all fields" });
    }
    const newPerson: CreatePerson = {
      id_document,
      type_document,
      name,
      last_name,
      phone
    };
    const person: Person = await createPerson(newPerson);
    return res.status(201).json(person);
  }catch(err){
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
}

export const updatePerson = async(req: Request, res :Response): Promise<Response> => {
  try {
    const { id, id_document, name, last_name, phone, type_document } = req.body;
    const personFound: Person = await getPersonById(id);
    if(!personFound){
      res.status(404).json({message: 'Person not found'});
    }
    
    const partialPerson: UpdatePerson = {
      id_document,
      type_document,
      name,
      last_name,
      phone
    };
    const updatedPerson: UpdatePerson = await updatePersonById(id, partialPerson);
    return res.status(201).json(updatedPerson);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
}

export const getPersonsClients = async (req: Request, res: Response): Promise<Response> => {
  try {
    const clients: Person[] = await getClients();
    return res.status(200).json(clients);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
}




