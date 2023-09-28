import { Express } from "express";
import { changeStateProduct, createNewProduct, deleteOneProduct, getAllProducts, getProductInfoById, updateOneProduct } from "../controllers/product.controller";
import validate from "../middlewares/ValidateSchema";
import { createProductSchema } from "../schemas/productRequests.schema";
import { changeStateBrandSchema } from "../schemas/brandRequests.schema";
import { authRequired } from "../middlewares/ValidateToken";

export default (app: Express): void => {
  /**
   * @openapi
   * components:
   *  schemas:
   *    CreateProduct:
*        type: object
*        required:
*           - name_product
*           - description
*           - measure_unit
*           - sale_price
*           - stock
*           - is_active
*           - brand_id
*           - category_id
*        example:
*           name_product: string
*           description: string
*           measure_unit: KG
*           sale_price: 5500
*           stock: 14
*           is_active: true
*           brand_id: string
*           category_id: string
*     
*/

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
    app.get("/api/product", authRequired, getAllProducts);

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
    app.get("/api/product/:id", authRequired, getProductInfoById);

  /**
   * @openapi
   * /api/product:
   *  post:
   *     tags:
   *     - Product
   *     summary: Create a product
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateProduct'
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/CreateProduct'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.post("/api/product", authRequired, validate(createProductSchema), createNewProduct);
  
    /**
   * @openapi
   * /api/product/state:
   *  put:
   *     tags:
   *     - Product
   *     summary: change state of a product
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/ChangeStateBrandRequest'
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/CreateProduct'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.put("/api/product/state", authRequired, validate(changeStateBrandSchema), changeStateProduct);

  /**
   * @openapi
   * /api/product/{id}:
   *  put:
   *     tags:
   *     - Product
   *     summary: Update a product
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: id of the product
   *        schema:
   *          type: string
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateProduct'
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/CreateProduct'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.put("/api/product/:id", authRequired, validate(createProductSchema), updateOneProduct);

  /**
   * @openapi
   * /api/product/{id}:
   *  delete:
   *     tags:
   *     - Product
   *     summary: Delete a product
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: id of the product
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
    app.delete("/api/product/:id", authRequired, deleteOneProduct);
}