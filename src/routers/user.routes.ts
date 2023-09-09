import { getAllUsers, updateUserFields } from "../controllers/user.controller";
import { Express } from "express";
import validate from "../middlewares/ValidateSchema";
import { updateUserSchema } from "../schemas/userRequests.schema";

export default (app: Express): void => {
 /**
   * @openapi
   * /api/users:
   *  get:
   *     tags:
   *     - User
   *     summary: get all users in an array
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/GetAllUsersResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
  app.get("/api/users", getAllUsers);

  /**
   * @openapi
   * /api/users:
   *  put:
   *     tags:
   *     - User
   *     summary: update user fields
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/UpdatePerson'
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/UpdatePersonResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
  app.put("/api/users", validate(updateUserSchema), updateUserFields);
}