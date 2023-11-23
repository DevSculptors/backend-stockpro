import supertest from 'supertest';
import { app } from '../index';
import { GenerateTokenPayload } from "../interfaces/User";
import { GenerateToken } from "../helpers/Token"; 

describe('Inventory Module', () => {
    let authToken: string;
    beforeAll(async() => {
     authToken = await GenerateToken({
      userId: "839f504e-5a69-4b44-84ba-a9631ca17468",
      role:"admin",
    } as GenerateTokenPayload);
    });

    it('should get all inventories and return a 200', async () => {
        const response = await supertest(app)
        .get('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('should create a new inventory and return a 200', async () => {
        const newInventory = {
            date_purchase: "2023-11-23T05:42:48.640Z",
            person_id: "09e983c5-bee5-497b-bf9f-aa9230773a48",
            user_id: "13a8f7ba-ccb6-4a28-ad82-3cfa4bfdd0f6",
            purchase_detail: [
                {
                quantity: 10,
                due_date: "2024-11-23T05:42:48.640Z",
                purchase_unit_price: 1000,
                sale_unit_price: 2000,
                product_id: "98c2ac88-3762-427b-a0a1-f8be22005ecd"
                }
            ]
        };
        const response = await supertest(app)
        .post('/api/inventory').send(newInventory)
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        const id = response.body.id;
        await supertest(app)
            .delete(`/api/inventory/${id}`)
            .set('Authorization', `Bearer ${authToken}`);
    }, 10000);

    
});