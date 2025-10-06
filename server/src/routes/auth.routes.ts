import { FastifyInstance } from 'fastify';
import { register, login, logout, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', {
    schema: {
      description: 'Créer un nouveau compte utilisateur',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', minLength: 8, example: 'Password123' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                createdAt: { type: 'string' },
              },
            },
          },
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, register);
  
  // Login
  fastify.post('/login', {
    schema: {
      description: 'Se connecter avec email et mot de passe',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', example: 'Password123' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                createdAt: { type: 'string' },
              },
            },
          },
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, login);
  
  // Logout (protected)
  fastify.post('/logout', {
    preHandler: authMiddleware,
    schema: {
      description: 'Se déconnecter (invalide le token)',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, logout);
  
  // Me (protected)
  fastify.get('/me', {
    preHandler: authMiddleware,
    schema: {
      description: 'Obtenir les informations de l\'utilisateur connecté',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                createdAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, me);
}