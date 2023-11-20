import { Express } from "express";

import { deleteSaleById, getAllSales, getInfoSaleById, getSalesReportByWeek, getTopCategories, getTopCategoriesByWeek, getTopSales, getTotalClients, getTotalProducts, getTotalRevenue, getTotalSales, registerSale } from "../controllers/sale.controller";
import { createSaleSchema } from "../schemas/saleRequests.schema";
import validate from "../middlewares/ValidateSchema";
import { authRequired } from "../middlewares/ValidateToken";

export default (app: Express): void => {

    /**
* @openapi
* components:
*  schemas:
*    TotalClients: 
*       type: object
*       required:
*           - totalRegisteredClients
*           - client
*       example:
*           totalRegisteredClients: number
*           client: {id: string, name: string, last_name: string, phone: string, email: string, id_document: string, type_document: string}
*    topSales:
*       type: object
*       required:
*           - person
*           - price_sale
*       example:
*           person: {name: string, last_name: string, phone: string}
*           price_sale: number
*    topSalesResponse:
*       type: array
*       items:
*           $ref: '#components/schemas/topSales'
*    topCategories:
*       type: object
*       required:
*           - category
*           - amount
*       example:
*           category: string
*           amount: number
*    topCategoriesResponse:
*       type: array
*       items:
*           $ref: '#components/schemas/topCategories'
*    CategoriesOfDay:
*       type: object
*       required:
*           - day
*           - value
*       example:
*           day: string
*           value: [{category: string, amount: number}]
*    CategoriesOfDayResponse:
*       type: array
*       items:
*           $ref: '#components/schemas/CategoriesOfDay'
*    SalesByWeek:
*       type: object
*       required:
*           - day
*           - value
*       example:
*           day: string
*           value: number
*    SalesByWeekResponse:
*       type: array
*       items:
*           $ref: '#components/schemas/SalesByWeek'
*    TotalMonthReportResponse:
*       type: object
*       required:
*           - total
*           - chartData
*       example:
*           total: number
*           chartData: [{day: string, value: number}]
*    TopSales:
*       type: object
*       required:
*           - person
*           - price_sale
*       example:
*           person: {name: string, last_name: string, phone: string}
*           price_sale: number
*    TopSalesResponse:
*       type: array
*       items:
*           $ref: '#components/schemas/TopSales'
*    SaleResponse:
*       type: object
*       required:
*           - id    
*           - date_sale
*           - price_sale
*           - person
*           - orders   
*           - turn
*       example:
*           id: string
*           date_sale: Date
*           price_sale: 1200 (precio total de la venta)
*           person: {id: string, name: string, last_name: string, phone: string, email: string, id_document: string, type_document: string}
*           orders: [{id: string, price: number (precio de la cantidad de unidades de un producto x precio individual), amount_product: number, product: {id: string, name_product: string, description: string, measure_unit: KG, sale_price: number, stock: number, brand: {id: string, name: string}, category: {id: string, name: string}}}]
*           turn: {id: string, date_time_start: Date, base_cash: number, date_time_end: Date, final_cash: number, is_active: boolean, user: {id: string, username: string, email: string, roleUser: cashier}}
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
*           - id_turn
*           - products
*       example:
*           price_sale: 1200
*           id_client: string
*           id_user: string
*           id_turn: string
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
   * /api/sales/reportByWeek:
   *  get:
   *     tags:
   *     - Report
   *     summary: get total sales by day of one week (Default last week)
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: query
   *        name: sundayDate 
   *        required: false
   *        description: sunday date of the week (optional)
   *        schema:
   *        type: string
   *        format: date
   *      - in: query
   *        name: saturdayDate  
   *        required: false
   *        description: saturday date of the week (optional)
   *        schema:
   *        type: string
   *        format: date
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/SalesByWeekResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales/reportByWeek", getSalesReportByWeek);

  /**
   * @openapi
   * /api/sales/topSales:
   *  get:
   *     tags:
   *     - Report
   *     summary: get top sales of clients (default return 10)
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: query
   *        name: top 
   *        required: false
   *        description: top number of sales (optional)
   *        schema:
   *        type: number
   *        format: int
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/topSalesResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales/topSales", getTopSales);

    /**
   * @openapi
   * /api/sales/topCategories:
   *  get:
   *     tags:
   *     - Report
   *     summary: get top categories (default return 10)
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: query
   *        name: top 
   *        required: false
   *        description: top number of categories (optional)
   *        schema:
   *        type: number
   *        format: int
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/topCategoriesResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales/topCategories", getTopCategories);

    /**
   * @openapi
   * /api/sales/topCategoriesByWeek:
   *  get:
   *     tags:
   *     - Report
   *     summary: Get top categories with number of products purchased last week by day of week (default return of 10 categories)
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: query
   *        name: top 
   *        required: false
   *        description: top number of categories (optional)
   *        schema:
   *        type: number
   *        format: int
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/CategoriesOfDayResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales/topCategoriesByWeek", getTopCategoriesByWeek)

  /**
   * @openapi
   * /api/sales/totalSales:
   *  get:
   *     tags:
   *     - Report
   *     summary: get total sales of this month with the total sales by day of week
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/TotalMonthReportResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales/totalSales", getTotalSales);

  /**
   * @openapi
   * /api/sales/totalRevenue:
   *  get:
   *     tags:
   *     - Report
   *     summary: get total revenue of this month with revenue by day of week
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/TotalMonthReportResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales/totalRevenue", getTotalRevenue);

  /**
   * @openapi
   * /api/sales/totalProducts:
   *  get:
   *     tags:
   *     - Report
   *     summary: get total products sold of this month with products sold by day of week
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/TotalMonthReportResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales/totalProducts", getTotalProducts);

  /**
   * @openapi
   * /api/sales/totalClients:
   *  get:
   *     tags:
   *     - Report
   *     summary: get total clients of this month with the best client of the month
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
  *               $ref: '#/components/schemas/TotalClients'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/sales/totalClients", getTotalClients);

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