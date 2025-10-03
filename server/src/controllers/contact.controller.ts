// backend/src/controllers/contact.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/db';
import { contacts } from '../db/schema';
import { eq, and, or, ilike } from 'drizzle-orm';
import { createContactSchema, updateContactSchema } from '../validators/contact.validator';
import { ZodError } from 'zod';

/**
 * Créer un nouveau contact
 */
export async function createContact(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = (request as any).userId;
    const data = createContactSchema.parse(request.body);

    const existingContact = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.userId, userId),
          eq(contacts.email, data.email)
        )
      )
      .limit(1);

    if (existingContact.length > 0) {
      return reply.status(409).send({
        error: 'Un contact avec cet email existe déjà',
      });
    }

    // Préparer les données selon le type
    const contactData: any = {
      userId,
      type: data.type,
      email: data.email,
    };

    if (data.type === 'individual') {
      contactData.firstName = data.firstName;
      contactData.lastName = data.lastName;
    } else {
      contactData.companyName = data.companyName;
      contactData.sirenNumber = data.sirenNumber;
    }

    // Créer le contact
    const [newContact] = await db
      .insert(contacts)
      .values(contactData)
      .returning();

    return reply.status(201).send({
      message: 'Contact créé avec succès',
      contact: newContact,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Données invalides',
        details: error.issues,
      });
    }

    console.error('Create contact error:', error);
    return reply.status(500).send({
      error: 'Erreur lors de la création du contact',
    });
  }
}

/**
 * Lister tous les contacts de l'utilisateur connecté
 */
export async function listContacts(
  request: FastifyRequest<{
    Querystring: { search?: string };
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request as any).userId;
    const { search } = request.query;

    let query = db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, userId));

    // Si recherche, filtrer par nom, email ou company
    if (search) {
      const searchPattern = `%${search}%`;
      query = db
        .select()
        .from(contacts)
        .where(
          and(
            eq(contacts.userId, userId),
            or(
              ilike(contacts.email, searchPattern),
              ilike(contacts.firstName, searchPattern),
              ilike(contacts.lastName, searchPattern),
              ilike(contacts.companyName, searchPattern)
            )
          )
        );
    }

    const userContacts = await query;

    return reply.status(200).send({
      contacts: userContacts,
      count: userContacts.length,
    });
  } catch (error) {
    console.error('List contacts error:', error);
    return reply.status(500).send({
      error: 'Erreur lors de la récupération des contacts',
    });
  }
}

/**
 * Obtenir un contact spécifique
 */
export async function getContact(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request as any).userId;
    const contactId = parseInt(request.params.id, 10);

    if (isNaN(contactId)) {
      return reply.status(400).send({
        error: 'ID de contact invalide',
      });
    }

    const [contact] = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.id, contactId),
          eq(contacts.userId, userId)
        )
      )
      .limit(1);

    if (!contact) {
      return reply.status(404).send({
        error: 'Contact non trouvé',
      });
    }

    return reply.status(200).send({ contact });
  } catch (error) {
    console.error('Get contact error:', error);
    return reply.status(500).send({
      error: 'Erreur lors de la récupération du contact',
    });
  }
}

/**
 * Mettre à jour un contact
 */
export async function updateContact(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request as any).userId;
    const contactId = parseInt(request.params.id, 10);

    if (isNaN(contactId)) {
      return reply.status(400).send({
        error: 'ID de contact invalide',
      });
    }

    // Vérifier que le contact existe et appartient à l'utilisateur
    const [existingContact] = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.id, contactId),
          eq(contacts.userId, userId)
        )
      )
      .limit(1);

    if (!existingContact) {
      return reply.status(404).send({
        error: 'Contact non trouvé',
      });
    }

    // Valider les données
    const data = updateContactSchema.parse(request.body);

    // Préparer les données selon le type
    const updateData: any = {
      type: data.type,
      email: data.email,
      updatedAt: new Date(),
    };

    if (data.type === 'individual') {
      updateData.firstName = data.firstName || existingContact.firstName;
      updateData.lastName = data.lastName || existingContact.lastName;
      // Effacer les champs professional si changement de type
      updateData.companyName = null;
      updateData.sirenNumber = null;
    } else {
      updateData.companyName = data.companyName || existingContact.companyName;
      updateData.sirenNumber = data.sirenNumber || existingContact.sirenNumber;
      // Effacer les champs individual si changement de type
      updateData.firstName = null;
      updateData.lastName = null;
    }

    // Mettre à jour le contact
    const [updatedContact] = await db
      .update(contacts)
      .set(updateData)
      .where(
        and(
          eq(contacts.id, contactId),
          eq(contacts.userId, userId)
        )
      )
      .returning();

    return reply.status(200).send({
      message: 'Contact mis à jour avec succès',
      contact: updatedContact,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Données invalides',
        details: error.issues,
      });
    }

    console.error('Update contact error:', error);
    return reply.status(500).send({
      error: 'Erreur lors de la mise à jour du contact',
    });
  }
}

/**
 * Supprimer un contact
 */
export async function deleteContact(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const userId = (request as any).userId;
    const contactId = parseInt(request.params.id, 10);

    if (isNaN(contactId)) {
      return reply.status(400).send({
        error: 'ID de contact invalide',
      });
    }

    // Supprimer le contact (seulement si appartient à l'utilisateur)
    const [deletedContact] = await db
      .delete(contacts)
      .where(
        and(
          eq(contacts.id, contactId),
          eq(contacts.userId, userId)
        )
      )
      .returning();

    if (!deletedContact) {
      return reply.status(404).send({
        error: 'Contact non trouvé',
      });
    }

    return reply.status(200).send({
      message: 'Contact supprimé avec succès',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    return reply.status(500).send({
      error: 'Erreur lors de la suppression du contact',
    });
  }
}