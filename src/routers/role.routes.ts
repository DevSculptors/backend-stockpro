import { Express } from "express";

import { getAllRoles, getRoleInfoById, createRole, deleteRole, updateRole } from "../controllers/role.controller";

export default (app: Express): void => {

 /**
* @openapi
* components:
*  schemas:
*    RoleResponse:
*       type: object
*       required:
*           - id    
*           - name
*           - description
*       example:
*           id: string
*           name: string
*           description: string
*    RolesResponse:
*       type: array
*       items:
*           $ref: '#components/schemas/RoleResponse'     
*    CreateRole:
*       type: object
*       required:
*           - name
*           - description 
*       example:
*           name: string
*           description: string
*     
*/

/**
   * @openapi
   * /api/roles:
   *  get:
   *     tags:
   *     - Role
   *     summary: get all roles in an array
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: integer
   *        description: page number (starts in 1)
   *      - in: query
   *        name: limit
   *        schema:
   *          type: integer
   *        description: limit of users per page (default 100)
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/RolesResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/roles", getAllRoles);

/**
   * @openapi
   * /api/roles/{id}:
   *  get:
   *     tags:
   *     - Role
   *     summary: get role info by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        description: role id
   *        schema:
   *            type: string    
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/RoleResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/roles/:id", getRoleInfoById);

    /**
   * @openapi
   * /api/roles:
   *  post:
   *     tags:
   *     - Role
   *     summary: Create a role
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateRole'
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/RoleResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.post("/api/roles", createRole);

    /**
   * @openapi
   * /api/roles/{id}:
   *  delete:
   *     tags:
   *     - Role
   *     summary: Delete a role
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: id of the role
   *        schema:
   *          type: string
   *     responses:
   *       204:
   *        description: success
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.delete("/api/roles/:id", deleteRole);

     /**
   * @openapi
   * /api/roles/{id}:
   *  put:
   *     tags:
   *     - Role
   *     summary: Update a role
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: id of the role
   *        schema:
   *          type: string
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateRole'
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/RoleResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.put("/api/roles/:id", updateRole);
}