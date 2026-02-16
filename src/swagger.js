import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SHT App API',
      version: '1.0.0',
      description: 'API documentation for Smart Hydration Tracker backend',
    },
    servers: [{ url: 'http://localhost:2000' }],
  },
  apis: ['./src/docs/*.js'],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
