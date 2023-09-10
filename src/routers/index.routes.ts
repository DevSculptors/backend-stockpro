import { Router } from "express";

import { Express } from "express";
import userRoutes from "./user.routes";
import personRoutes from "./person.routes";
import authRoutes from "./auth.routes";

const router = Router();
export default function(app: Express): Router {
  /**
   * @openapi
   * components:
   *  schemas:
   *   createUser:
   *    type: object
   *    required:
   *      - username
   *      - password
   *      - isActive
   *      - email
   *      - id_document
   *      - type_document
   *      - name
   *      - last_name
   *      - phone
   *      - role
   *    properties:
   *      username:
   *        type: string
   *        description: The username for the user min 5 characters
   *        required: true
   *      password:
   *        type: string
   *        description: The password for the user min 6 characters
   *        required: true
   *      isActive:
   *        type: boolean
   *        description: The status of the user
   *        required: true
   *      email:
   *        type: string
   *        description: The email for the user
   *        required: true
   *      id_document:
   *        type: string
   *        description: The id_document for the user
   *        required: true
   *      type_document:
   *        type: string ['CC', 'CE', 'TI', 'NIT', 'PP']
   *        description: The type_document for the user
   *        required: true
   *      name:
   *        type: string
   *        description: The name for the user
   *        required: true
   *      last_name:
   *        type: string
   *        description: The lastname for the user
   *        required: true
   *      phone:
   *       type: string
   *       description: The phone for the user
   *       required: true
   *      role:
   *        type: string
   *        description: The role for the user
   *        required: true
   *    example:  
   *       username: johndoe
   *       password: stringPassword123
   *       isActive: true
   *       email: jhon.doe@example.com 
   *       id_document: '123456789' 
   *       type_document: CC
   *       name: John
   *       last_name: Doe
   *       phone: '1234567890'
   *       role: admin
   *   BadRequest:
   *    type: object
   *    required:
   *     - message
   *    example:
   *      message: error message
   *   LogoutResponse:
   *    type: object 
   *    required:
   *      - message
   *    example:
   *      message: Logout successfully
   *   VerifiedTokenResponse:
   *    type: object
   *    required:
   *      - isAuthorized: 
   *        type: boolean
   *      - user:
   *        type: object
   *        properties:
   *          id:
   *            type: string
   *          username:
   *            type: string
   *          password:
   *            type: string
   *          isActive:
   *            type: boolean
   *          email:
   *            type: string
   *          personId:
   *            type: string
   *      - roles:
   *        type: array    
   *    example:
   *      isAuthorized: true
   *      user: jhondoe 
   *      password: string
   *      isActive: true
   *      email: jhon.doe@example.com
   *      personId: string
   *      roles: ['admin']
   *   ForgetPasswordInput:
   *    type: object
   *    required:
   *      - email
   *    example:
   *      email: jhon.doe@example.com
   *   ForgetPasswordResponse:
   *    type: object
   *    required:
   *      - message
   *      - forgetUrl
   *    example:
   *      message: Email sent successfully
   *      forgetUrl: https://example.com
   *   ChangePasswordInput:
   *    type: object
   *    required:
   *      - newPassword
   *      - confirmPassword
   *    example:
   *      newPassword: stringPassword123
   *      confirmPassword: stringPassword123
   *   ChangePasswordResponse:
   *    type: object
   *    required:
   *      - message  
   *    example:
   *      - message: Password changed successfully
   *   UserResponse:
   *    type: object
   *    required:
   *      - id
   *      - username
   *      - isActive
   *      - email
   *      - personId
   *    example:
   *      id: string
   *      username: jhondoe
   *      isActive: true
   *      email: string 
   *      personId: string 
   *   GetAllPersonsResponse:
   *    type: array
   *    items:
   *      $ref: '#components/schemas/PersonResponse'
   *   GetAllUsersResponse:
   *    type: array
   *    items:
   *      $ref: '#components/schemas/UserResponse'   
   *   UsersWithPersonDataResponse:
   *    type: object
   *    required:
   *      - id
   *      - username
   *      - isActive
   *      - email 
   *      - person
   *    example:
   *      id: string
   *      username: jhondoe
   *      isActive: true
   *      email: string
   *      person: { id: string, id_document: string, type_document: string, name: string, last_name: string, phone: string}
   *   UpdatePerson:
   *    type: object
   *    required:
   *      - id
   *      - username
   *      - isActive
   *      - email
   *      - roleName
   *      - personId    
   *      - id_document
   *      - type_document
   *      - name
   *      - last_name
   *      - phone
   *    example:
   *      id: string  
   *      username: jhondoe
   *      isActive: true
   *      email: string
   *      roleName: string
   *      personId: string
   *      id_document: string
   *      type_document: string
   *      name: string
   *      last_name: string
   *      phone: string  
   *   PersonResponse:
   *    type: object
   *    required:
   *      - id
   *      - id_document
   *      - type_document
   *      - name
   *      - last_name
   *      - phone
   *    example:
   *      id: string
   *      id_document: string
   *      type_document: string
   *      name: string
   *      last_name: string
   *      phone: string
   *   RoleResponse:
   *    type: object
   *    required:
   *     - name: string
   *    example:
   *      name: string  
   *   RolesResponse: 
   *    type: array
   *    items:
   *      $ref: '#components/schemas/RoleResponse'
   *   UpdatePersonResponse:
   *    type: object
   *    required:
   *     - updatedUser
   *     - updatedPerson
   *     - listOfRoles
   *    properties:
   *      updatedUser:
   *        $ref: '#components/schemas/UserResponse'
   *      updatedPerson:
   *        $ref: '#components/schemas/PersonResponse'
   *      listOfRoles:
   *        $ref: '#components/schemas/RolesResponse'
   *   CreatePerson:
   *    type: object
   *    required:
   *      - id_document
   *      - type_document
   *      - name
   *      - last_name
   *      - phone 
   *    example:
   *      id_document: '111111'
   *      type_document: 'CC'
   *      name: jhon
   *      last_name: doe
   *      phone: '3216549871'
   *   UpdatePersonRequest:
   *    type: object
   *    required:
   *      - id
   *      - id_document
   *      - type_document
   *      - name
   *      - last_name
   *      - phone
   *    example:
   *      id: string
   *      id_document: '111111'
   *      type_document: 'CC'
   *      name: jhon
   *      last_name: doe
   *      phone: '3216549871'
   *   TokenResponse:
   *    type: object
   *    required:
   *      - token
   *    example:
   *      token: string
   *   ChangeStateResponse:
   *    type: object
   *    required:
   *      - isActive
   *    example:
   *      isActive: false 
   */
  authRoutes(app);
  userRoutes(app);
  personRoutes(app);
  return router;
};
