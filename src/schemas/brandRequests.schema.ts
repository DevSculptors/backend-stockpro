import { boolean, z } from "zod";

import { object, string, TypeOf } from "zod";

export const createBrandSchema = object({
    body: object({
        name: string().min(1, {
            message: "Es necesario ingresar el nombre"
        }),
        is_active: boolean(),
        description: string(),
    }),
});

export const changeStateBrandSchema = object({
    body: object({
        id: string().min(32, {
            message: "El id es inválido"
        }).max(32, {
            message: "El id es inválido"
        }),
        is_active: boolean(),
    }),
});
