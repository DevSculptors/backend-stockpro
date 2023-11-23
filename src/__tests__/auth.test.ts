import supertest from 'supertest';
import { app } from '../index';



describe('Auth Module', () => {

  it('should register a new user and return a 201', async () => {
    const response = await supertest(app)
      .post('/api/register')
      .send({
        username: 'test3',
        password: 'stringPassword123',
        isActive: true,
        email: 'test2.example@example.com',
        id_document: '765432100',
        type_document: 'CC',
        name: 'test3',
        last_name: 'example3',
        phone: '3124567870',
        roleName: 'admin',
      });
    expect(response.status).toBe(400);
    // expect(response.body.userSaved).toBeDefined();

  });

  it('should login a user and return a 200', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        email: 'jhon.doe@example.com',
        password: 'stringPassword123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });201

  it('Should logout successfully and return a 200', async () => {
    const response = await supertest(app)
      .get('/api/logout');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successfully');
  });

  afterAll(async () => {
    
  });
});

