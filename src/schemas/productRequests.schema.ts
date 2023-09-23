import { object, string, enum as enum_ } from "zod";
import { boolean, z } from "zod";

export const createProductSchema = object({
    body: object({
        name_product: string().min(3, {
            message: "Es necesario ingresar el nombre"
        }),
        description: string().min(0, {
            message: "Es necesario ingresar la descripción"
        }),
        measure_unit: enum_(["KG", "UNITS", "LITERS", "POUNDS"]),
        sale_price: z.number().min(0, {
            message: "Es necesario ingresar el precio de venta"
        }),
        stock: z.number().min(0, {
            message: "Es necesario ingresar el stock"
        }),
        is_active: boolean(),
        brand_id: string().min(36, {
            message: "El id es inválido"
        }).max(36, {
            message: "El id es inválido"
        }),
        category_id: string().min(36, {
            message: "El id es inválido"
        }).max(36, {
            message: "El id es inválido"
        }),
    }),
});