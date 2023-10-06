import { authRequired } from "../middlewares/ValidateToken";
import { deleteInventoryPurchase, getAllInventoryPurchases, getInventoryPurchaseById, insertInventoryPurchase } from "../controllers/Inventory.controller";
import { Express } from "express";
import { validateUUID } from "../middlewares/ValidateId";
import validate from "../middlewares/ValidateSchema";
import { createInventoryPurchaseSchema } from "../schemas/inventoryRequests.schema";

export default (app: Express): void => {
/**
* @openapi
* components:
*  schemas:
*    InventoryPurchaseResponse:
*       type: object
*       required:
*           - id    
*           - date_purchase
*           - user
*           - person
*           - purchase_detail
*       example:
*           id: string
*           date_purchase: Date
*           total_price: 1200 (precio total de la compra)
*           user: {id: string, username: string, email: string}
*           person: {id: string, name: string, last_name: string}
*           purchase_detail: [{quantity: number, due_date: Date, purchase_unit_price: number, product: {id: string, name_product: string, brand: {id: string, name: string}, category: {id: string, name: string}}}]
*    GetAllInventoryPurchasesResponse:
*       type: array
*       items:
*           $ref: '#components/schemas/InventoryPurchaseResponse'     
*    CreateInventoryPurchase:
*       type: object
*       required:
*           - date_purchase
*           - person_id 
*           - user_id
*           - purchase_detail
*       example:
*           date_purchase: Date (puede usar new Date())
*           person_id: string
*           user_id: string
*           purchase_detail: [{quantity: number, due_date: Date, purchase_unit_price: number, product_id: string}]
*     
*/

    /**
   * @openapi
   * /api/inventory:
   *  get:
   *     tags:
   *     - Inventory
   *     summary: Get All Inventory Purchases
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetAllInventoryPurchasesResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/inventory", authRequired ,getAllInventoryPurchases);

    /**
   * @openapi
   * /api/inventory/{id}:
   *  get:
   *     tags:
   *     - Inventory
   *     summary: get inventory purchase by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        description: inventory purchase id
   *        schema:
   *            type: string    
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/InventoryPurchaseResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/inventory/:id", authRequired , validateUUID, getInventoryPurchaseById);

    /**
   * @openapi
   * /api/inventory:
   *  post:
   *     tags:
   *     - Inventory
   *     summary: Create a inventory purchase
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateInventoryPurchase'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/InventoryPurchaseResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.post("/api/inventory", authRequired , validate(createInventoryPurchaseSchema),insertInventoryPurchase);

    /**
   * @openapi
   * /api/inventory/{id}:
   *  delete:
   *     tags:
   *     - Inventory
   *     summary: delete a inventory purchase by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: inventory purchase id
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
   *       404:
   *        description: Not found
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/NotFound' 
   */
    app.delete("/api/inventory/:id", authRequired , validateUUID, deleteInventoryPurchase);
}