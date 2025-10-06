import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import * as dotenv from 'dotenv';
import { testConnection } from './db/db';
import { authRoutes } from './routes/auth.routes';
import { contactRoutes } from './routes/contact.routes';

dotenv.config();

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: false, // désactive le mode strict
    },
  },
});

// Swagger Documentation
fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Stampee Contact Management API',
      description: 'API de gestion de contacts avec authentification JWT',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

// Swagger UI
fastify.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  staticCSP: true,
});

// CORS configuration
fastify.register(cors, {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Enregistrer les routes d'authentification
fastify.register(authRoutes, { prefix: '/api/auth' });

// Enregistrer les routes de contacts
fastify.register(contactRoutes, { prefix: '/api/contacts' });

// Route de test
fastify.get('/api/health', {
  schema: {
    description: 'Health check endpoint',
    tags: ['Health'],
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
}, async (request, reply) => {
  return { status: 'ok', message: 'Server is running' };
});

// Démarrer le serveur
const start = async () => {
  try {
    // Tester la connexion à la base de données
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    const PORT = parseInt(process.env.PORT || '3000', 10);
    
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Swagger documentation on http://localhost:${PORT}/documentation`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();