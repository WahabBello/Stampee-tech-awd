import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';


// Middleware pour protéger les routes
// Vérifie la présence et la validité du token JWT

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Extraire le token du header Authorization
    const token = extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      return reply.status(401).send({
        error: 'Token manquant. Authentification requise.',
      });
    }

    // Vérifier et décoder le token
    const payload = verifyToken(token);

    // Ajouter les infos de l'utilisateur à la requête
    (request as any).userId = payload.userId;
    (request as any).userEmail = payload.email;

    // Continuer vers la route suivante
  } catch (error) {
    return reply.status(401).send({
      error: 'Token invalide ou expiré',
    });
  }
}