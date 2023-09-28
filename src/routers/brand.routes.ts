import { Express } from "express";

import { changeStateBrand, createBrand, deleteBrandById, editBrand, getBrandInfoById, getBrands } from "../controllers/brand.controller";
import validate from "../middlewares/ValidateSchema";
import { changeStateBrandSchema, createBrandSchema } from "../schemas/brandRequests.schema";
import { authRequired } from "../middlewares/ValidateToken";


export default (app: Express): void => {
    
    /**
   * @openapi
   * /api/brand:
   *  get:
   *     tags:
   *     - Brand (Marca)
   *     summary: Get All brands
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
   *        description: limit of brands per page 
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetAllBrandsResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/brand", authRequired, getBrands);

  /**
   * @openapi
   * /api/brand:
   *  post:
   *     tags:
   *     - Brand (Marca)
   *     summary: create a brand
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    $ref: '#/components/schemas/CreateBrand'
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Brand'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.post("/api/brand", authRequired, validate(createBrandSchema), createBrand);

    /**
   * @openapi
   * /api/brand/state:
   *  put:
   *     tags:
   *     - Brand (Marca)
   *     summary: Change state a brand
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/ChangeStateBrandRequest'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ChangeStateResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.put("/api/brand/state", authRequired ,validate(changeStateBrandSchema), changeStateBrand);

    /**
   * @openapi
   * /api/brand/{id}:
   *  put:
   *     tags:
   *     - Brand (Marca)
   *     summary: Update a brand
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: brand id
   *        schema:
   *          type: string 
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateBrand'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Brand'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.put("/api/brand/:id", authRequired, validate(createBrandSchema), editBrand);

    /**
   * @openapi
   * /api/brand/{id}:
   *  get:
   *     tags:
   *     - Brand (Marca)
   *     summary: Get a brand by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: brand id
   *        schema:
   *          type: string
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Brand'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/brand/:id", authRequired, getBrandInfoById);


  /**
   * @openapi
   * /api/brand/{id}:
   *  delete:
   *     tags:
   *     - Brand (Marca)
   *     summary: delete a brand by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: brand id
   *        schema:
   *          type: string
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Brand'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   *       404:
   *        description: Not found
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/NotFound' 
   */
    app.delete("/api/brand/:id", authRequired, deleteBrandById);
}