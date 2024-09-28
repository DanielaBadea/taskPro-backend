const swaggerUi = require('swagger-ui-express'); 
const swaggerJsdoc = require('swagger-jsdoc'); 

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'This is the API documentation for TaskPro backend',
        },
        servers: [
            {
                url: 'http://localhost:3000/',
                description: 'Local API base URL',
            },
            {
                url: 'https://taskpro-app-bcac9d37037a.herokuapp.com/ ',
                description: 'Heroku API base URL',
            },
        ],
    },
    
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
