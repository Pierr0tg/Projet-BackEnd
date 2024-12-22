const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Spot On API',
      version: '1.0.0',
      description: 'API REST pour la gestion des tickets et des transactions',
      contact: {
        name: 'Ton Nom',
        email: 'ton.email@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Serveur local',
      },
    ],
  },
  apis: ['./routes/*.js'], // Changez ce chemin si nécessaire
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
