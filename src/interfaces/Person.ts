
export interface Person {
  id: number;
  id_document: string;
  type_document: any;
  name: string;
  last_name: string;
  phone: string;
  email: string;
}

//Persona sin ID, para crear
export type CreatePerson = Omit<Person, "id">;

//Persona sin ID, para actualizar
export type UpdatePerson = Partial<CreatePerson>;
