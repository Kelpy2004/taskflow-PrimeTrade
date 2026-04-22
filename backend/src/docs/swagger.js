import swaggerJsdoc from 'swagger-jsdoc';

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Glacier Task Engine API',
    version: '1.0.0',
    description: 'Recruiter-ready task management API with JWT auth, RBAC, admin controls, and audit logs.',
  },
  servers: [{ url: 'http://localhost:4000', description: 'Local development server' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'user'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
          owner: { $ref: '#/components/schemas/User' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ActivityLog: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          actionType: { type: 'string', enum: ['task.created', 'task.updated', 'task.deleted'] },
          actor: { $ref: '#/components/schemas/User' },
          task: { type: 'string', nullable: true },
          taskTitleSnapshot: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                name: 'Demo User',
                email: 'user@example.com',
                password: 'Password123',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
          },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                email: 'admin@example.com',
                password: 'Password123',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Authenticated successfully',
          },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Fetch current authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current user returned' },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout (clears auth cookie)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Logged out' },
        },
      },
    },
    '/api/v1/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List tasks for the current user or all tasks for admins',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'status', schema: { type: 'string' } },
          { in: 'query', name: 'page', schema: { type: 'number' } },
          { in: 'query', name: 'limit', schema: { type: 'number' } },
        ],
        responses: {
          200: { description: 'Task list returned' },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a new task',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                title: 'Prepare recruiter handoff',
                description: 'Finalize README and Swagger docs.',
                status: 'pending',
              },
            },
          },
        },
        responses: {
          201: { description: 'Task created' },
        },
      },
    },
    '/api/v1/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        summary: 'Get one task by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task returned' },
        },
      },
      patch: {
        tags: ['Tasks'],
        summary: 'Update an existing task',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                title: 'Prepare recruiter handoff',
                description: 'README, Swagger docs, and demo notes updated.',
                status: 'in-progress',
              },
            },
          },
        },
        responses: {
          200: { description: 'Task updated' },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task deleted' },
        },
      },
    },
    '/api/v1/admin/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Get admin dashboard stats',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Stats returned' },
        },
      },
    },
    '/api/v1/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List users',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Users returned' },
        },
      },
    },
    '/api/v1/admin/tasks': {
      get: {
        tags: ['Admin'],
        summary: 'List all tasks',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Tasks returned' },
        },
      },
    },
    '/api/v1/admin/logs': {
      get: {
        tags: ['Admin'],
        summary: 'List audit logs',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Audit logs returned' },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  definition: spec,
  apis: [],
});
