import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

/**
 * Swagger/OpenAPI configuration
 */
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventHub API',
      version: '1.0.0',
      description: 'Complete Event Management Backend API with authentication, events, contacts, and profile management',
      contact: {
        name: 'EventHub Team',
        email: 'support@eventhub.example',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Development server',
      },
      {
        url: 'https://api.eventhub.example',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            ok: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Invalid input data',
                },
                details: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
              nullable: true,
            },
            countryCode: {
              type: 'string',
              example: '+1',
            },
            mobile: {
              type: 'string',
              example: '1234567890',
            },
            dob: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other', 'prefer_not_to_say'],
              nullable: true,
            },
            photoUrl: {
              type: 'string',
              nullable: true,
            },
            isMobileVerified: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            linkUrl: {
              type: 'string',
              nullable: true,
            },
            bannerUrl: {
              type: 'string',
              nullable: true,
            },
            startsAt: {
              type: 'string',
              format: 'date-time',
            },
            isPublished: {
              type: 'boolean',
            },
            createdBy: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Contact: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
              nullable: true,
            },
            phone: {
              type: 'string',
              nullable: true,
            },
            notes: {
              type: 'string',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check and status endpoints',
      },
      {
        name: 'Auth',
        description: 'Authentication and authorization endpoints',
      },
      {
        name: 'Profile',
        description: 'User profile management',
      },
      {
        name: 'Events',
        description: 'Event management operations',
      },
      {
        name: 'Contacts',
        description: 'Contact management operations',
      },
      {
        name: 'Upload',
        description: 'File upload operations',
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
