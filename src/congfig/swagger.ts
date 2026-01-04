import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Workout Tracker API",
    version: "1.0.0",
    description: "API documentation for the Workout Tracker",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], 
};

export const swaggerSpec = swaggerJSDoc(options);
