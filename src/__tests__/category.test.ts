import supertest from "supertest";
import { app } from "../index";
import { GenerateTokenPayload } from "../interfaces/User";
import { GenerateToken } from "../helpers/Token";

describe('Category module', () => {
  let authToken: string
    beforeAll(async() => {
     authToken = await GenerateToken({
      userId: "839f504e-5a69-4b44-84ba-a9631ca17468",
      role:"admin",
    } as GenerateTokenPayload);
  });

  it('should get all categories and return a 200', async () => {
    const response = await supertest(app)
      .get('/api/category')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  it('should create a new category and return a 200', async () => {
    const newCategory = {
      name: 'Nueva Categoría',
      is_active: true,
      description: 'Descripción de la nueva categoría',
    };

    const response = await supertest(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newCategory);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    const id = response.body.id;
    await supertest(app)
      .delete(`/api/category/${id}`)
      .set('Authorization', `Bearer ${authToken}`);
  });

  it('should get a category by ID and return a 200', async () => {
    const categoryId = '0a8b75a6-2438-485b-8747-f4ed352650a1';

    const response = await supertest(app)
      .get(`/api/category/${categoryId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });


  it('should change the state of a category and return a 200', async () => {
    
    const categoryId = '0a8b75a6-2438-485b-8747-f4ed352650a1';

    const changeStateRequest = {
      id: categoryId, 
      is_active: false, // Cambia el estado según tus necesidades
    };

    const response = await supertest(app)
      .put(`/api/category/state`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(changeStateRequest);

    expect(response.status).toBe(200);
  });

  it('should update a category by ID and return a 200', async () => {
    // Reemplaza 'category-123' con un ID de categoría válido
    const categoryId = '0a8b75a6-2438-485b-8747-f4ed352650a1';

    const updatedCategory = {
      name: 'Categoría Actualizada',
      description: 'Descripción actualizada',
      is_active: true,
    };

    const response = await supertest(app)
      .put(`/api/category/${categoryId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedCategory);

    expect(response.status).toBe(200);
  });
  
  afterAll(async () => {
    
  });

});
