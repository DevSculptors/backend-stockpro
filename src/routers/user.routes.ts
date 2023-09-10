import { getAllUsers, updateUserFields, changeState, getUserInfoById } from "../controllers/user.controller";
import { Express } from "express";
import validate from "../middlewares/ValidateSchema";
import { changeStateSchema, updateUserSchema } from "../schemas/userRequests.schema";
import { authRequired } from "../middlewares/ValidateToken";

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
  *               $ref: '#/components/schemas/UsersWithPersonDataResponse'  
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
   * /api/users/{id}:
   *  put:
   *     tags:
   *     - User
   *     summary: update user fields
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: user id
   *        schema:
   *          type: string 
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/UpdatePerson'
   *     responses:
   *       201:
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
  app.put("/api/users/:id", validate(updateUserSchema), updateUserFields);

 /**
   * @openapi
   * /api/users/state:
   *  put:
   *     tags:
   *     - User
   *     summary: change state of user
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/ChangeStateRequest'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/ChangeStateResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
  app.put("/api/users/state", validate(changeStateSchema), changeState);

  /**
   * @openapi
   * /api/users/{id}:
   *  get:
   *     tags:
   *     - User
   *     summary: get user info by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: user id
   *        schema:
   *          type: string
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/UsersWithPersonDataResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
  app.get("/api/users/:id", authRequired ,getUserInfoById);

  app.delete("/api/users");
}