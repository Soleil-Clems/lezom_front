const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lezom API",
      version: "1.0.0",
      description: "API documentation for Lezom backend",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "clxyz123" },
            email: { type: "string", format: "email", example: "user@example.com" },
            username: { type: "string", example: "johndoe" },
            firstname: { type: "string", example: "John" },
            lastname: { type: "string", example: "Doe" },
            role: { type: "string", enum: ["MEMBER", "ADMIN"], example: "MEMBER" },
            status: { type: "string", example: "online" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        Server: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid-123" },
            name: { type: "string", example: "My Server" },
            ownerId: { type: "string", example: "uuid-456" },
            role: { type: "string", enum: ["OWNER", "ADMIN", "MEMBER"], example: "MEMBER" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ServerMember: {
          type: "object",
          properties: {
            userId: { type: "string", example: "uuid-123" },
            username: { type: "string", example: "johndoe" },
            firstname: { type: "string", example: "John" },
            lastname: { type: "string", example: "Doe" },
            status: { type: "string", example: "online" },
            role: { type: "string", enum: ["OWNER", "ADMIN", "MEMBER"], example: "MEMBER" },
            joinedAt: { type: "string", format: "date-time" },
          },
        },
        Invitation: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid-123" },
            code: { type: "string", example: "abc123def456" },
            maxUses: { type: "integer", nullable: true, example: 10 },
            uses: { type: "integer", example: 0 },
            expiresAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
