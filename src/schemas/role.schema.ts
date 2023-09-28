import { boolean, number, z } from "zod";

import { object, string, TypeOf } from "zod";

export const createRoleSchema = object({
    body: object({
        name: string().min(0, {
            message: "Nombre no válido"
        }).max(50, {
            message: "Nombre no válido"
        }),
        description: string().min(0, {
            message: "Descripción no válida"
        }).max(100, {
            message: "Descripción no válida"
        })
    }),
});