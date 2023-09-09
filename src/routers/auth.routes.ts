import { Express } from "express";

import {
  register,
  login,
  logout,
  verifyToken,
  forgetPassword,
  changePassword,
} from "../controllers/auth.controller";
import validate from "../middlewares/ValidateSchema";
import { changePasswordSchema, createUser, forgetPasswordSchema, loginSchema } from "../schemas/userRequests.schema";

function authRoutes(app: Express): void {

  /**
   * @openapi
   * /api/register:
   *  post:
   *     tags:
   *     - Register
   *     summary: Register a new user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/createUser'
   *     responses:
   *       200:
   *        description: User registered successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/loginResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema: 
   *               $ref: '#/components/schemas/BadRequest'
   * 
   */
  app.post("/api/register", validate(createUser), register);

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
   *              $ref: '#/components/schemas/loginResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest'
   */
  app.post("/api/login",validate(loginSchema) , login);

  /**
   * @openapi
   * /api/logout:
   *  get:
   *     tags:
   *     - Logout
   *     summary: logout a user
   *     responses:
   *       200:
   *         description: user logged out successfully
   *         content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/LogoutResponse'
   */  
  app.get("/api/logout", logout);

  /**
   * @openapi
   * /api/verify-token:
   *  get:
   *     tags:
   *     - Verify-token
   *     summary: verify a user token
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: verified successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/VerifiedTokenResponse' 
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
  app.get("/api/verify-token", verifyToken);

  /**
   * @openapi
   * /api/forget-password:
   *  post:
   *     tags:
   *     - forget-password
   *     summary: forget password
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/ForgetPasswordInput'
   *     responses:
   *       200:
   *         description: Email send successfully
   *         content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ForgetPasswordResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest'
   */
  app.post("/api/forget-password", validate(forgetPasswordSchema), forgetPassword);

  /**
   * @openapi
   * /api/change-password:
   *  post:
   *     tags:
   *     - change-password
   *     summary: change password
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *           $ref: '#/components/schemas/ChangePasswordInput'
   *     responses:
   *      200:
   *        description: changed successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ChangePasswordResponse'
   *      400:
   *       description: Bad request
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/BadRequest'
   *         
   */
  app.post("/api/change-password", validate(changePasswordSchema), changePassword);
};

export default authRoutes;
