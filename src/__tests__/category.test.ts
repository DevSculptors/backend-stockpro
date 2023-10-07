import supertest from "supertest";
import { app } from "../index";
import { GenerateTokenPayload } from "../interfaces/User";
import { GenerateToken } from "../helpers/Token";

describe('Category', () => {
  let authToken: string
    beforeAll(async() => {
     authToken = await GenerateToken({
      userId: "8509ac75-75cb-4f21-b2fc-5cd2db3eb26f",
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
      name: 'Nueva Categoría1',
      is_active: true,
      description: 'Descripción de la nueva categoría',
    };

    const response = await supertest(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newCategory);

    expect(response.status).toBe(200);
    
  });

  it('should get a category by ID and return a 200', async () => {
    const categoryId = '271b37de-bee5-4e9a-a124-425cdacc30df';

    const response = await supertest(app)
      .get(`/api/category/${categoryId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });


  it('should change the state of a category and return a 200', async () => {
    
    const categoryId = 'eb374ef6-507a-4b6e-a979-bfb9cf853f76';

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
    const categoryId = '271b37de-bee5-4e9a-a124-425cdacc30df';

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
  

});
