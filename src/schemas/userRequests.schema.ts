import { boolean, z } from "zod";

import { object, string, TypeOf } from "zod";
import { emailRegex } from "./auth.schema";

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
    email: string({
      required_error: "Email is required",
    }),
    password: string(),
  }),
});



export const createUser = object({
  body: object({
    username: string({
      required_error: "Username is required",
    }).min(5).max(255),
    password: string({
      required_error: "Password is required",
    }).min(6).max(255),
    isActive: boolean({
      required_error: "isActive is required",
    }),
    email: string({
      required_error: "Email is required",
    }).regex(emailRegex),
    id_document: string({
      required_error: "id_document is required",
    }).min(8),
    type_document: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP'], {
      required_error: "type_document is required",
    }
    ),
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
})

export const forgetPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required"
    }).regex(emailRegex)
  }),
});

export const changePasswordSchema = object({
  body: object({
    newPassword: string({
      required_error: "newPassword is required"
    }).min(6).max(255),
    confirmPassword: string({
      required_error: "confirmPassword is required"
    }).min(6).max(255)
  }),
});

export const updateUserSchema = object({
  body: object({
    username: string({
      required_error: "username is required"
    }),
    isActive: boolean({
      required_error: "isActive is required"
    }),
    email: string({
      required_error: "email is required"
    }).regex(emailRegex),
    personId: string({
      required_error: "personId is required"
    }),
    id_document: string({
      required_error: "id_document is required"
    }),
    type_document: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP'], {required_error: "type_document is required"}),
    name: string({required_error: "name is required"}),
    last_name: string({required_error: "last_name is required"}),
    phone: string({required_error:"phone is required"}).min(10),
    roleName: string({required_error: "roleName is required"}), 
  }),
});

export const changeStateSchema = object({
  body: object({
    id: string({
      required_error: "id is required"
    }).min(36).max(36),
    isActive: boolean({
      required_error: "isActive is required"
    })
  }),
});

export type UpdateUser = Partial<TypeOf<typeof createUser>>

// Omite el email del body
export type CreateUserSinEmail = Omit<
  TypeOf<typeof createUser>,
  "body.email"
>





