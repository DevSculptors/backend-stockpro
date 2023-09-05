import { z } from "zod";

import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *    LoginResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        id:
 *          type: string
 */
export const loginSchema = z.object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string().min(6),
  }),
});



export const createUser = object({
  body: object({
    username: string({
      required_error: "Username is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
    email: string({
      required_error: "Email is required",
    }),
  }),
})

export type UpdateUser = Partial<TypeOf<typeof createUser>>

// Omite el email del body
export type CreateUserSinEmail = Omit<
  TypeOf<typeof createUser>,
  "body.email"
>



