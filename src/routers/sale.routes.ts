import { Express } from "express";

import { deleteSaleById, getAllSales, getInfoSaleById, registerSale } from "../controllers/sale.controller";
import { createSaleSchema } from "../schemas/saleRequests.schema";
import validate from "../middlewares/ValidateSchema";
import { authRequired } from "../middlewares/ValidateToken";

export default (app: Express): void => {

    /**
* @openapi
* components:
*  schemas:
*    SaleResponse:
*       type: object
*       required:
*           - id    
*           - date_sale
*           - price_sale
*           - person
*           - user
*           - orders   
*       example:
*           id: string
*           date_sale: Date
*           price_sale: 1200 (precio total de la venta)
*           person: {id: string, name: string, last_name: string, phone: string, email: string, id_document: string, type_document: string}
*           user: {id: string, username: string, email: string, isActive: boolean, person: {id: string, name: string, last_name: string, phone: string, id_document: string, type_document: string}, roleUser: cashier}
*           orders: [{id: string, amount_product: number, product: {id: string, name_product: string, description: string, measure_unit: KG, sale_price: number, stock: number, brand: {id: string, name: string}, category: {id: string, name: string}}}]
*    SalesResponse:
*       type: array
*       items:
*           $ref: '#components/schemas/SaleResponse'     
*    CreateSale:
*       type: object
*       required:
*           - price_sale
*           - id_client
*           - id_user
*           - products
*       example:
*           price_sale: 1200
*           id_client: string
*           id_user: string
*           products: [{id: string, amount_product: 5}] 
*     
*/


    /**
   * @openapi
   * /api/sales:
   *  get:
   *     tags:
   *     - Sale
   *     summary: get all sales in an array
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/SalesResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales", authRequired, getAllSales);

     /**
   * @openapi
   * /api/sales/{id}:
   *  get:
   *     tags:
   *     - Sale
   *     summary: get sale by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: id of sale
   *        schema:
   *          type: string
   *        format: uuid
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/SaleResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales/:id", authRequired, getInfoSaleById);

		 /**
   * @openapi
   * /api/sales:
   *  post:
   *     tags:
   *     - Sale
   *     summary: Create a sale
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateSale'
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/SaleResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
		app.post("/api/sales", authRequired, validate(createSaleSchema), registerSale);

    /**
   * @openapi
   * /api/sales/{id}:
   *  delete:
   *     tags:
   *     - Sale
   *     summary: Delete a sale
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: id of the sale
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
    app.delete("/api/sales/:id", authRequired, deleteSaleById);
}