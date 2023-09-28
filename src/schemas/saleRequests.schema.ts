import { boolean, number, z } from "zod";

import { object, string, TypeOf } from "zod";
const regexDate = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3}$/;

export const createSaleSchema = object({
    body: object({
        price_sale: number().min(0, {
            message: "Precio no válido"
        }),  
        id_client: string().min(36, {
            message: "El id es inválido"
        }).max(36, {
            message: "El id es inválido"
        }),
        id_user: string().min(36, {
            message: "El id es inválido"
        }).max(36, {
            message: "El id es inválido"
        }),
        products: z.array(object({
            id: string().min(36, {
                message: "El id es inválido"
            }).max(36, {
                message: "El id es inválido"
            }),
            amount_product: number().min(0, {
                message: "Cantidad no válida"
            })
        }))
    }),
});