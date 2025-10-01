
import { FastifyInstance } from 'fastify';
import { register, login, logout, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  // Routes publiques
  fastify.post('/register', register);
  fastify.post('/login', login);
  
  // Routes protégées
  fastify.post('/logout', { preHandler: authMiddleware }, logout);
  fastify.get('/me', { preHandler: authMiddleware }, me);
}