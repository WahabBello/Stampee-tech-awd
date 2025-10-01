import { FastifyInstance } from 'fastify';
import {
  createContact,
  listContacts,
  getContact,
  updateContact,
  deleteContact,
} from '../controllers/contact.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function contactRoutes(fastify: FastifyInstance) {
  // Toutes les routes sont protégées par le middleware d'authentification
  fastify.addHook('preHandler', authMiddleware);

  // CRUD routes
  fastify.post('/', createContact);
  fastify.get('/', listContacts);
  fastify.get('/:id', getContact);
  fastify.put('/:id', updateContact);
  fastify.delete('/:id', deleteContact);
}
