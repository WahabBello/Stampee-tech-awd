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

  // Créer un contact
  fastify.post('/', {
    schema: {
      description: 'Créer un nouveau contact (Individual ou Professional)',
      tags: ['Contacts'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['type', 'email'],
        properties: {
          type: { 
            type: 'string', 
            enum: ['individual', 'professional'],
            description: 'Type de contact'
          },
          // Champs Individual
          firstName: { 
            type: 'string', 
            minLength: 1,
            maxLength: 100,
            example: 'Jean'
          },
          lastName: { 
            type: 'string', 
            minLength: 1,
            maxLength: 100,
            example: 'Dupont'
          },
          // Champs Professional
          companyName: { 
            type: 'string', 
            minLength: 1,
            maxLength: 255,
            example: 'Stampee SAS'
          },
          sirenNumber: { 
            type: 'string', 
            pattern: '^\\d{9}',
            example: '123456789',
            description: 'Numéro SIREN à 9 chiffres'
          },
          // Champs communs
          email: { 
            type: 'string', 
            format: 'email',
            example: 'contact@example.com'
          },
        },
      },
      response: {
        201: {
          description: 'Contact créé avec succès',
          type: 'object',
          properties: {
            message: { type: 'string' },
            contact: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                type: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                companyName: { type: 'string' },
                sirenNumber: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
        400: {
          description: 'Données invalides',
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array' },
          },
        },
        409: {
          description: 'Un contact avec cet email existe déjà',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, createContact);

  // Lister tous les contacts
  fastify.get('/', {
    schema: {
      description: 'Récupérer la liste de tous les contacts de l\'utilisateur',
      tags: ['Contacts'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          search: { 
            type: 'string',
            description: 'Rechercher dans les noms, emails, entreprises',
            example: 'Jean'
          },
        },
      },
      response: {
        200: {
          description: 'Liste des contacts',
          type: 'object',
          properties: {
            contacts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  type: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  companyName: { type: 'string' },
                  sirenNumber: { type: 'string' },
                  email: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
            count: { type: 'number' },
          },
        },
      },
    },
  }, listContacts);

  // Obtenir un contact spécifique
  fastify.get('/:id', {
    schema: {
      description: 'Récupérer les détails d\'un contact par son ID',
      tags: ['Contacts'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { 
            type: 'number',
            description: 'ID du contact',
            example: 1
          },
        },
      },
      response: {
        200: {
          description: 'Détails du contact',
          type: 'object',
          properties: {
            contact: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                type: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                companyName: { type: 'string' },
                sirenNumber: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
        404: {
          description: 'Contact non trouvé',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, getContact);

  // Modifier un contact
  fastify.put('/:id', {
    schema: {
      description: 'Mettre à jour un contact existant',
      tags: ['Contacts'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { 
            type: 'number',
            description: 'ID du contact',
            example: 1
          },
        },
      },
      body: {
        type: 'object',
        required: ['type', 'email'],
        properties: {
          type: { 
            type: 'string', 
            enum: ['individual', 'professional'],
            description: 'Type de contact (non modifiable)'
          },
          // Champs Individual
          firstName: { 
            type: 'string', 
            minLength: 1,
            maxLength: 100,
            example: 'Jean'
          },
          lastName: { 
            type: 'string', 
            minLength: 1,
            maxLength: 100,
            example: 'Martin'
          },
          // Champs Professional
          companyName: { 
            type: 'string', 
            minLength: 1,
            maxLength: 255,
            example: 'Stampee SAS'
          },
          sirenNumber: { 
            type: 'string', 
            pattern: '^\\d{9}',
            example: '987654321'
          },
          // Champs communs
          email: { 
            type: 'string', 
            format: 'email',
            example: 'nouveau@example.com'
          },
        },
      },
      response: {
        200: {
          description: 'Contact mis à jour avec succès',
          type: 'object',
          properties: {
            message: { type: 'string' },
            contact: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                type: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                companyName: { type: 'string' },
                sirenNumber: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
        400: {
          description: 'Données invalides',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        404: {
          description: 'Contact non trouvé',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, updateContact);

  // Supprimer un contact
  fastify.delete('/:id', {
    schema: {
      description: 'Supprimer un contact',
      tags: ['Contacts'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { 
            type: 'number',
            description: 'ID du contact à supprimer',
            example: 1
          },
        },
      },
      response: {
        200: {
          description: 'Contact supprimé avec succès',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        404: {
          description: 'Contact non trouvé',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, deleteContact);
}