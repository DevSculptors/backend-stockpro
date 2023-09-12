import validate from "../middlewares/ValidateSchema";
import { changeSate, createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "../controllers/categoryProduct.controller";
import { Express } from "express";
import { changeStateBrandSchema, createBrandSchema } from "../schemas/brandRequests.schema";


export default (app: Express): void => {
     /**
   * @openapi
   * /api/category:
   *  get:
   *     tags:
   *     - Category
   *     summary: Get All categories
   *     security: 
   *      - bearerAuth: []
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
    app.get("/api/category", getAllCategories);

   /**
   * @openapi
   * /api/category:
   *  post:
   *     tags:
   *     - Category
   *     summary: create a category
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
    app.post("/api/category", validate(createBrandSchema),createCategory);

    /**
   * @openapi
   * /api/category/{id}:
   *  get:
   *     tags:
   *     - Category
   *     summary: Get a category by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: category id
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
    app.get("/api/category/:id", getCategory);

     /**
   * @openapi
   * /api/category/state:
   *  put:
   *     tags:
   *     - Category
   *     summary: Change state a category 
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
     app.put("/api/category/state", validate(changeStateBrandSchema), changeSate);

      /**
   * @openapi
   * /api/category/{id}:
   *  put:
   *     tags:
   *     - Category
   *     summary: Update a category by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: category id
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
    app.put("/api/category/:id", validate(createBrandSchema), updateCategory);

      /**
   * @openapi
   * /api/category/{id}:
   *  delete:
   *     tags:
   *     - Category
   *     summary: delete a category by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: category id
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
    app.delete("/api/category/:id", deleteCategory);
}