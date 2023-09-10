import { Express } from "express";

import {
  getPersonsController,
  createPersonController,
  updatePerson,
  getPersonsClients,
} from "../controllers/person.controller";
import { authRequired } from "../middlewares/ValidateToken";
import validate from "../middlewares/ValidateSchema";
import { createPersonSchema, updatePersonSchema } from "../schemas/personRequest.schema";

export default (app: Express): void => {
   /**
   * @openapi
   * /api/person:
   *  get:
   *     tags:
   *     - Person
   *     summary: Get All persons
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/GetAllPersonsResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
  app.get("/api/person", authRequired, getPersonsController);

  /**
   * @openapi
   * /api/person:
   *  post:
   *     tags:
   *     - Person
   *     summary: Create a person
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreatePerson'
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/UpdatePersonRequest'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
  app.post("/api/person", authRequired, validate(createPersonSchema), createPersonController);

  /**
   * @openapi
   * /api/person:
   *  put:
   *     tags:
   *     - Person
   *     summary: Update a person 
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/UpdatePersonRequest'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UpdatePersonRequest'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
  app.put("/api/person", authRequired, validate(updatePersonSchema), updatePerson);

  /**
   * @openapi
   * /api/client:
   *  get:
   *     tags:
   *     - Client
   *     summary: Get all Clients
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/GetAllPersonsResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
  app.get("/api/client", authRequired, getPersonsClients);
};
