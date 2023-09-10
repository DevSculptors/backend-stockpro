import { boolean, z } from "zod";

import { object, string, TypeOf } from "zod";
import { emailRegex } from "./auth.schema";

export const createPersonSchema = object({
    body: object({
        id_document: string({
            required_error: "id_document is required",
        }).min(8),
        type_document: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP'], {
            required_error: "type_document is required",
        }),
        name: string({
            required_error: "name is required",
        }),
        last_name: string({
            required_error: "last_name is required",
        }),
        phone: string({
            required_error: "phone is required",
        }).min(10),
    }),
});

export const updatePersonSchema = object({
    body: object({
        id: string({
            required_error: "id is required",
        }).min(36).max(36),
        id_document: string({
            required_error: "id_document is required",
        }).min(8),
        type_document: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP'], {
            required_error: "type_document is required",
        }),
        name: string({
            required_error: "name is required",
        }),
        last_name: string({
            required_error: "last_name is required",
        }),
        phone: string({
            required_error: "phone is required",
        }).min(10),
    }),
});