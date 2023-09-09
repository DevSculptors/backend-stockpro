import { Express } from "express";

import {
  getPersonsController,
  createPersonController,
  updatePerson,
} from "../controllers/person.controller";
import { authRequired } from "../middlewares/ValidateToken";

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

};
