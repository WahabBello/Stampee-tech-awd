import Fastify from 'fastify';
import cors from '@fastify/cors';
import * as dotenv from 'dotenv';
import { testConnection } from './db/db';
import { authRoutes } from './routes/auth.routes';
import { contactRoutes } from './routes/contact.routes';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// CORS configuration
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});

// Enregistrer les routes d'authentification
fastify.register(authRoutes, { prefix: '/api/auth' });

// Enregistrer les routes de contacts
fastify.register(contactRoutes, { prefix: '/api/contacts' });


// Route de test
fastify.get('/api/test', async (request, reply) => {
  return { status: 'ok', message: 'Server is running' };
});

// Démarrer le serveur
const start = async () => {
  try {
    // Connexion BDD
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    const PORT = parseInt(process.env.PORT || '3000', 10);
    
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();