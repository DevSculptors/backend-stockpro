import { boolean, z } from "zod";

import { object, string, TypeOf } from "zod";

export const createBrandSchema = object({
    body: object({
        name: string({
            required_error: "Name is required",
        }),
        is_active: boolean({
            required_error: "is_active is required",
        }),
        description: string({
            required_error: "description is required",
        }),
    }),
});

export const changeStateBrandSchema = object({
    body: object({
        id: string({ required_error: "Id is required"}),
        is_active: boolean({ required_error: "is_active is required"}),
    }),
});
