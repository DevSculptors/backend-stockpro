import supertest from "supertest";
import { app } from "../index";
import { GenerateTokenPayload } from "../interfaces/User";
import { GenerateToken } from "../helpers/Token";

describe('Brand', () => {
  let authToken: string
    beforeAll(async() => {
     authToken = await GenerateToken({
      userId: "8509ac75-75cb-4f21-b2fc-5cd2db3eb26f",
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
      name: 'Nueva Marca',
      is_active: true,
      description: 'Descripción de la nueva marca',
    };

    const response = await supertest(app)
      .post('/api/brand')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBrand);

    expect(response.status).toBe(200);
    
  });

  it('should change the state of a brand and return a 200', async () => {
    
    const brandId = '5300ff50-04f2-49f7-865d-da0486c4de0c';

    const changeStateRequest = {
      id: brandId, 
      is_active: false, // Cambia el estado según tus necesidades
    };

    const response = await supertest(app)
      .put(`/api/brand/state`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(changeStateRequest);

    expect(response.status).toBe(200);
  });

  it('should update a brand by ID and return a 201', async () => {
    const brandId = '5300ff50-04f2-49f7-865d-da0486c4de0c';

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
    const brandId = '5300ff50-04f2-49f7-865d-da0486c4de0c';

    const response = await supertest(app)
      .get(`/api/brand/${brandId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });


  

});
