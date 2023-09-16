import { Express } from "express";
import { getAllProducts, getProductInfoById } from "../controllers/product.controller";

export default (app: Express): void => {
    /**
   * @openapi
   * /api/product:
   *  get:
   *     tags:
   *     - Product
   *     summary: get all products in an array
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *        - in: query
   *          name: page
   *          schema: 
   *            type: integer
   *          description: page number (starts in 1)
   *        - in: query
   *          name: limit
   *          schema:
   *            type: integer
   *          description: limit of products per page (default 10)
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/GetAllProductsResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/product", getAllProducts);

    /**
   * @openapi
   * /api/product/{id}:
   *  get:
   *     tags:
   *     - Product
   *     summary: Get product info by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: product_id
   *        schema:
   *          type: string 
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Product'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/product/:id", getProductInfoById);
}