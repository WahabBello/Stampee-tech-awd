import { z } from 'zod';

// Schéma pour l'inscription
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe est trop long'),
});

// Schéma pour la connexion
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"),
  password: z
    .string()
    .min(1, 'Mot de passe requis'),
});

// Types TypeScript exportés
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;