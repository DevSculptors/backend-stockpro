import {Express, Request, Response} from 'express'

import {loginSchema} from '../schemas/login.schema'
import {login} from '../controllers/auth.controller'

import validate from '../middlewares/ValidateSchema';

function authRoutes(app: Express): void {

  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  /**
   * @openapi
   * '/api/login':
   *  post:
   *     tags:
   *     - User
   *     summary: Login a User
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/LoginInput'
   *     responses:
   *      200:
   *        description: Success
   
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/LoginResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post("/api/login", validate(loginSchema),login);

}

export default authRoutes;
