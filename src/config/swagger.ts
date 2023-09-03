import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API Backend of stockpro', 
      version: '1.0.0', 
      description: 'Documentación de la API backend stock pro', 
    },
  },
  apis: ['./routers/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);
