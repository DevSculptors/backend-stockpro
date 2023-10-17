import { Express } from "express";
import { authRequired } from "../middlewares/ValidateToken";
import { closeTurnForCashRegister, createCashRegister, deleteCashRegister, getAllCashRegister, getOneCashRegister, openTurnForCashRegister, saveWithdrawal, updateOneCashRegister } from "../controllers/CashRegister.controller";
import { validateUUID } from "../middlewares/ValidateId";
import validate from "../middlewares/ValidateSchema";
import { closeTurnSchema, createCashRegisterSchema, createTurnSchema, createWithdrawalSchema, updateCashRegisterSchema } from "../schemas/cashRegister.schema";

export default (app: Express): void => {

    /**
* @openapi
* components:
*  schemas:
*    CashRegisterResponse:
*       type: object
*       required:
*           - id    
*           - name
*           - location
*           - turns
*       example:
*           id: string
*           name: string
*           location: string
*           turns: [{id: string, date_time_start: Date, base_cash: number, date_time_end: Date, final_cash: number ,is_active: boolean, user: {id: string, username: string, email: string}, withdrawals: [{id: string, withdrawal_date: Date, value: number}]}]
*    GetAllCashRegisterResponse:
*       type: array
*       items:
*           $ref: '#components/schemas/CashRegisterResponse'     
*    CreateCashRegister:
*       type: object
*       required:
*           - name
*           - location 
*       example:
*           name: string
*           location: string
*    CreatedCashRegisterResponse:
*       type: object
*       required:
*           - id
*           - name
*           - location
*       example:
*           id: string
*           name: string
*           location: string     
*    CreateTurn:
*       type: object
*       required:
*           - date_time_start
*           - base_cash
*           - id_user
*       example:
*           date_time_start: Date
*           base_cash: number
*           id_user: string
*    CloseTurn:
*       type: object
*       required:
*           - id_turn
*           - date_time_end
*           - final_cash
*       example:
*           id_turn: string
*           date_time_end: Date
*           final_cash: number
*    CreateWithdrawal:
*       type: object 
*       required:
*           - withdrawal_date
*           - value
*       example:
*           withdrawal_date: Date
*           value: 20000
*    WithdrawalResponse:
*       type: object
*       required:
*           - id 
*           - withdrawal_date
*           - value
*       example:
*           id: string
*           withdrawal_date: Date
*           value: 20000
*/
     
    /**
   * @openapi
   * /api/cashRegister:
   *  get:
   *     tags:
   *     - CashRegister
   *     summary: Get All Cash Registers
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetAllCashRegisterResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/cashRegister", authRequired, getAllCashRegister);

     /**
   * @openapi
   * /api/cashRegister/{id}:
   *  get:
   *     tags:
   *     - CashRegister
   *     summary: Get a cash register by id
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: cash register id
   *        schema:
   *          type: string
   *     security: 
   *      - bearerAuth: []
   *     responses:
   *       200:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CashRegisterResponse'  
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.get("/api/cashRegister/:id", authRequired, validateUUID, getOneCashRegister);

     /**
   * @openapi
   * /api/cashRegister:
   *  post:
   *     tags:
   *     - CashRegister
   *     summary: Create a Cash Register
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateCashRegister'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/CreatedCashRegisterResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.post("/api/cashRegister", authRequired, validate(createCashRegisterSchema),createCashRegister);

       /**
   * @openapi
   * /api/cashRegister:
   *  put:
   *     tags:
   *     - CashRegister
   *     summary: Update a cash register
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreatedCashRegisterResponse'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreatedCashRegisterResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.put("/api/cashRegister", authRequired, validate(updateCashRegisterSchema), updateOneCashRegister);

     /**
   * @openapi
   * /api/cashRegister/{id}:
   *  post:
   *     tags:
   *     - CashRegister
   *     summary: Open a turn in a Cash Register
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: cash register id
   *        schema:
   *          type: string
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateTurn'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/CashRegisterResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.post("/api/cashRegister/:id", authRequired, validateUUID, validate(createTurnSchema),openTurnForCashRegister);

      /**
   * @openapi
   * /api/cashRegister/{id}:
   *  put:
   *     tags:
   *     - CashRegister
   *     summary: Close a turn in a Cash Register
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: cash register id
   *        schema:
   *          type: string
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CloseTurn'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/CashRegisterResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.put("/api/cashRegister/:id", authRequired, validateUUID, validate(closeTurnSchema), closeTurnForCashRegister);

      /**
   * @openapi
   * /api/cashRegister/turn/{id}:
   *  post:
   *     tags:
   *     - CashRegister
   *     summary: Save a withdrawal associated with a turn
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: turn id
   *        schema:
   *          type: string
   *     security: 
   *      - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateWithdrawal'
   *     responses:
   *       201:
   *        description: success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/WithdrawalResponse'
   *       400:
   *        description: Bad request
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/BadRequest' 
   */
    app.post("/api/cashRegister/turn/:id", authRequired, validateUUID, validate(createWithdrawalSchema), saveWithdrawal);

       /**
   * @openapi
   * /api/cashRegister/{id}:
   *  delete:
   *     tags:
   *     - CashRegister
   *     summary: delete a cash register by id
   *     security: 
   *      - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        description: cash register id
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
    app.delete("/api/cashRegister/:id", authRequired, validateUUID, deleteCashRegister);
}