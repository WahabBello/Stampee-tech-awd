import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { ZodError } from 'zod';

/**
 * Inscription d'un nouvel utilisateur
 */
export async function register(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Valider les données
    const { email, password } = registerSchema.parse(request.body);

    // Vérifier si l'email existe déjà
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return reply.status(400).send({
        error: 'Cet email est déjà utilisé',
      });
    }

    // Hasher le mot de passe
    const passwordHash = await hashPassword(password);

    // Créer l'utilisateur
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
      })
      .returning();

    // Générer le token JWT
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    return reply.status(201).send({
      message: 'Inscription réussie',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Données invalides',
        details: error.issues,
      });
    }

    console.error('Register error:', error);
    return reply.status(500).send({
      error: 'Erreur lors de l\'inscription',
    });
  }
}

// Connexion d'un utilisateur

export async function login(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Valider les données
    const { email, password } = loginSchema.parse(request.body);

    // Trouver l'utilisateur
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return reply.status(401).send({
        error: 'Email ou mot de passe incorrect',
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return reply.status(401).send({
        error: 'Email ou mot de passe incorrect',
      });
    }

    // Générer le token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return reply.status(200).send({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Données invalides',
        details: error.issues,
      });
    }

    console.error('Login error:', error);
    return reply.status(500).send({
      error: 'Erreur lors de la connexion',
    });
  }
}

// Déconnexion
export async function logout(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Avec JWT, la déconnexion se fait côté client en supprimant le token
  // On retourne juste un message de succès
  return reply.status(200).send({
    message: 'Déconnexion réussie',
  });
}

// Obtenir l'utilisateur connecté

export async function me(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Le middleware auth ajoute userId à request
    const userId = (request as any).userId;

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return reply.status(404).send({
        error: 'Utilisateur non trouvé',
      });
    }

    return reply.status(200).send({ user });
  } catch (error) {
    console.error('Me error:', error);
    return reply.status(500).send({
      error: 'Erreur lors de la récupération de l\'utilisateur',
    });
  }
}