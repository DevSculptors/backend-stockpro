import { boolean, z } from "zod";

import { object, string, TypeOf } from "zod";
export const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

export const createPersonSchema = object({
    body: object({
        id_document: string().min(8, {
            message: "El número de documento debe tener al menos 8 caracteres"
        }),
        type_document: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP']),
        name: string().min(1, {
            message: "Es necesario ingresar el nombre"
        }),
        last_name: string().min(1, {
            message: "Es necesario ingresar el apellido"
        }),
        phone: string().min(10, {
            message: "El número telefónico debe tener 10 caracteres"
        }).max(10, {
            message: "El número telefónico debe tener 10 caracteres"
        }),
    }),
});