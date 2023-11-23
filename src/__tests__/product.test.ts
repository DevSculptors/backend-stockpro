import supertest from 'supertest';
import { app } from '../index';
import { GenerateTokenPayload } from "../interfaces/User";
import { GenerateToken } from "../helpers/Token"; 

describe('Product Module', () => {
    let authToken: string; 
    beforeAll(async() => {
     authToken = await GenerateToken({
      userId: "839f504e-5a69-4b44-84ba-a9631ca17468",
      role:"admin",
    } as GenerateTokenPayload);
    });

    it('should get all products and return a 200', async () => {
        const response = await supertest(app)
        .get('/api/product')
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('should create a new product and return a 200', async () => {
        const newProduct = {
            name_product: "Platano maduro",
            description: "un platano",
            measure_unit: "KG",
            sale_price: 3500,
            stock: 14,
            is_active: true,
            brand_id: "b4ee12bf-77c1-4de8-8d41-1d0fb8b3f4a6",
            category_id: "85550bfa-d837-4708-b519-84bd79439809"
        };
        const response = await supertest(app)
        .post('/api/product').send(newProduct)
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        const id = response.body.id;
        await supertest(app)
            .delete(`/api/product/${id}`)
            .set('Authorization', `Bearer ${authToken}`);
    });

    it('should update a product and return a 200', async () => {
        const updatedProduct = {
            name_product: "Platano maduro",
            description: "un platano",
            measure_unit: "KG",
            sale_price: 3500,
            stock: 14,
            is_active: true,
            brand_id: "b4ee12bf-77c1-4de8-8d41-1d0fb8b3f4a6",
            category_id: "85550bfa-d837-4708-b519-84bd79439809"
        };
        const response = await supertest(app)
        .post('/api/product').send(updatedProduct)
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        const id = response.body.id;
        await supertest(app)
            .put(`/api/product/${id}`).send(updatedProduct)
            .set('Authorization', `Bearer ${authToken}`);
        await supertest(app)
            .delete(`/api/product/${id}`)
            .set('Authorization', `Bearer ${authToken}`);
    });

    it('should get a product by ID and return a 200', async () => {
        const productId = '434bb72c-47fa-432b-9453-442ac16cd710';
        const response = await supertest(app)
        .get(`/api/product/${productId}`)
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
    });

    it('should set a state of product by ID and return a 200', async () => {
        const productId = '434bb72c-47fa-432b-9453-442ac16cd710';
        const response = await supertest(app)
        .put(`/api/product/state`)
        .send({
            id: productId,
            is_active: false
        })
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        await supertest(app).put(`/api/product/state`)
            .send({
                id: productId,
                is_active: true
            }).set('Authorization', `Bearer ${authToken}`);
    });

    afterAll(async () => {
        
    });
});