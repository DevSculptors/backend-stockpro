import { boolean, z } from "zod";

import { object, string, TypeOf } from "zod";
import { emailRegex } from "./personRequest.schema";

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
 *          default: jhon.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *    LoginResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        username:
 *          type: string
 *        password: 
 *          type: string 
 *        isActive: 
 *          type: boolean
 *        email: 
 *          type: string
 *        personId:
 *          type: string
 *    loginResponse:
 *      type: object
 *      required:
 *       - userFound
 *       - token
 *      properties:
 *        userFound:
 *          $ref: '#/components/schemas/LoginResponse'
 *        token:
 *          $ref: '#/components/schemas/Token' 
 */
export const loginSchema = z.object({
  body: object({
    email: string().regex(emailRegex,{
      message: "El email no es válido"
    }),
    password: string(),
  }),
});



export const createUser = object({
  body: object({
    username: string().min(5,{
      message: "El usuario debe tener mínimo 5 caracteres"
    }).max(255),
    password: string().min(6, {
      message: "La contraseña debe tener mínimo 6 caracteres"
    }).max(255),
    isActive: boolean(),
    email: string().regex(emailRegex,{
      message: "El email no es válido"
    }),
    id_document: string().min(8,{
      message: "El número de documento debe tener al menos 8 caracteres"
    }).max(10, {
      message: "El documento debe tener máximo 11 caracteres"
    }),
    type_document: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP']),
    name: string().min(1, {message: "Es necesario ingresar el nombre"}),
    last_name: string().min(1, {message: "Es necesario ingresar el apellido"}),
    phone: string().min(10, {
      message: "El número telefónico debe tener 10 caracteres"
    }).max(10, {
      message: "El número telefónico debe tener 10 caracteres"
    }),  
  })
})

export const forgetPasswordSchema = object({
  body: object({
    email: string().regex(emailRegex,{
      message: "El email no es válido"
    })
  }),
});

export const changePasswordSchema = object({
  body: object({
    newPassword: string().min(6,{
      message: "La contraseña debe tener mínimo 6 caracteres"
    }).max(255, {
      message: "La contraseña debe tener máximo 255 caracteres"
    }),
    confirmPassword: string().min(6, {
      message: "La contraseña debe tener mínimo 6 caracteres"
    }).max(255, {
      message: "La contraseña debe tener máximo 255 caracteres"
    })
  }),
});

export const updateUserSchema = object({
  body: object({
    username: string().min(5, {
      message: "El usuario debe tener mínimo 5 caracteres"
    }),
    isActive: boolean(),
    email: string().regex(emailRegex, {
      message: "El email no es válido"
    }),
    personId: string(),
    id_document: string().min(8, {
      message: "El número de documento debe tener al menos 8 caracteres"
    }), 
    type_document: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP']),
    name: string().min(1, {message: "Es necesario ingresar el nombre"}),
    last_name: string().min(1, {message: "Es necesario ingresar el apellido"}),
    phone: string().min(10, {
      message: "El número telefónico debe tener 10 caracteres"
    }).max(10, {
        message: "El número telefónico debe tener 10 caracteres"
    }),
    roleName: string(), 
  }),
});

export const changeStateSchema = object({
  body: object({
    id: string().min(36,{
      message: "El id no es invalido"
    }).max(36, {
      message: "El id no es invalido"
    }),
    isActive: boolean()
  }),
});

export type UpdateUser = Partial<TypeOf<typeof createUser>>

// Omite el email del body
export type CreateUserSinEmail = Omit<
  TypeOf<typeof createUser>,
  "body.email"
>





