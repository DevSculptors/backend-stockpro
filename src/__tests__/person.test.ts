import supertest from 'supertest';
import { app } from '../index';
import { GenerateTokenPayload } from "../interfaces/User";
import { GenerateToken } from "../helpers/Token"; 

describe('Person Module', () => {
    let authToken: string;
    beforeAll(async() => {
     authToken = await GenerateToken({
      userId: "839f504e-5a69-4b44-84ba-a9631ca17468",
      role:"admin",
    } as GenerateTokenPayload);
    });

    it('should get all persons and return a 200', async () => { 
        const response = await supertest(app)
        .get('/api/person')
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('should create a new person and return a 200', async () => {
        const newPerson = {
            id_document: "00000000",
            type_document: "CC",
            name: "test",
            last_name: "person",
            phone: "3124322567"
        };
        const response = await supertest(app)
        .post('/api/person').send(newPerson)
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        const id = response.body.id;
        await supertest(app)
            .delete(`/api/person/${id}`)
            .set('Authorization', `Bearer ${authToken}`);
    });

    it('should update a person and return a 200', async () => {
        const updatedPerson = {
            id_document: "11111111",
            type_document: "CC",
            name: "test-1",
            last_name: "person",
            phone: "3145678890"
        };
        const response = await supertest(app)
        .post('/api/person').send(updatedPerson)
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        const id = response.body.id;
        await supertest(app)
            .put(`/api/person/${id}`).send(updatedPerson)
            .set('Authorization', `Bearer ${authToken}`);

        await supertest(app)
            .delete(`/api/person/${id}`)
            .set('Authorization', `Bearer ${authToken}`);
    });

    it('should get a person by ID and return a 200', async () => {
        const personId = 'd87cd545-bad6-4d23-a9bc-f5c92dacf39c';
        const response = await supertest(app)
        .get(`/api/person/${personId}`)
        .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
    });

    afterAll(async () => {
        
    });
});