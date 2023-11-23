import supertest from "supertest";
import { app } from "../index";
import { GenerateTokenPayload } from "../interfaces/User";
import { GenerateToken } from "../helpers/Token";

describe('Brand module', () => {
  let authToken: string
    beforeAll(async() => {
     authToken = await GenerateToken({
      userId: "839f504e-5a69-4b44-84ba-a9631ca17468",
      role:"admin",
    } as GenerateTokenPayload);
  });

  it('should get all brands and return a 200', async () => {
    const response = await supertest(app)
      .get('/api/brand')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  it('should create a new brand and return a 200', async () => {
    const newBrand = {
      name: 'Nueva Marca 2',
      is_active: true,
      description: 'Descripción de la nueva marca',
    };

    const response = await supertest(app)
      .post('/api/brand')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBrand);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    const id = response.body.id;
    await supertest(app)
      .delete(`/api/brand/${id}`)
      .set('Authorization', `Bearer ${authToken}`);
  });

  it('should change the state of a brand and return a 200', async () => {
    
    const brandId = 'c56aaf9b-e656-4e60-87c8-8271366eaa1f';

    const changeStateRequest = {
      id: brandId, 
      is_active: true, // Cambia el estado según tus necesidades
    };

    const response = await supertest(app)
      .put(`/api/brand/state`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(changeStateRequest);

    expect(response.status).toBe(200);
  });

  it('should update a brand by ID and return a 201', async () => {
    const brandId = 'c56aaf9b-e656-4e60-87c8-8271366eaa1f';

    const updatedBrand = {
      name: 'Marca Actualizada',
      description: 'Descripción actualizada',
      is_active: true,
    };

    const response = await supertest(app)
      .put(`/api/brand/${brandId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedBrand);

    expect(response.status).toBe(201);
  });
  
  it('should get a brand by ID and return a 200', async () => {
    const brandId = 'c56aaf9b-e656-4e60-87c8-8271366eaa1f';

    const response = await supertest(app)
      .get(`/api/brand/${brandId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    
  });
});
