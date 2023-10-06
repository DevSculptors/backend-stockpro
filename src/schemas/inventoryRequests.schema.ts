import { number, z } from "zod";

import { object, string, array } from "zod";
const regexDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/;

export const createInventoryPurchaseSchema = object({
    body: object({
        date_purchase: string().regex(regexDate, {
            message: "Fecha no válida"
        }),
        person_id: string().min(36, {
            message: "El id es inválido"
        }).max(36, {
            message: "El id es inválido"
        }),
        user_id: string().min(36, {
            message: "El id es inválido"
        }).max(36, {
            message: "El id es inválido"
        }),
        purchase_detail: array(object({
            quantity: number().min(1, {
                message: "Cantidad no válida"
            }),
            due_date: string().regex(regexDate, {
                message: "Fecha no válida"
            }),
            purchase_unit_price: number().min(100, {
                message: "Precio no válido"
            }),
            product_id: string().min(36, {
                message: "El id es inválido"
            }).max(36, {
                message: "El id es inválido"
            }),
        })),
    }),
});