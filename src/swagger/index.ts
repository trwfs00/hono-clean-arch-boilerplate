import { Hono } from "hono"

export const swaggerRoute = new Hono()
export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Hono Clean Architecture Boilerplate API",
    version: "1.0.0",
    description: "API for Hono Clean Architecture Boilerplate",
    contact: {
      name: "API Support",
      email: "support@yourdomain.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://api.yourdomain.com",
      description: "Production server",
    },
  ],
  paths: {
    "/api/v1/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        description: "Returns the health status of the API",
        operationId: "getHealth",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
          },
          code: {
            type: "string",
            description: "Error code",
          },
          details: {
            type: "object",
            description: "Additional error details",
          },
        },
        required: ["error"],
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "ok",
            description: "Health status of the API",
          },
        },
        required: ["status"],
      },
    },
    responses: {
      BadRequest: {
        description: "Bad request",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      Unauthorized: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      InternalServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
    },
  },
  tags: [
    {
      name: "System",
      description: "System and health check endpoints",
    },
  ],
}

swaggerRoute.get("/", c => {
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Swagger UI</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({ url: '/openapi.json', dom_id: '#swagger-ui' });
      </script>
    </body>
    </html>
  `)
})
