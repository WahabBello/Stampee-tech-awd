import { z } from 'zod';

// Validation pour les contacts de type "Individual"
export const individualContactSchema = z.object({
  type: z.literal('individual'),
  firstName: z.string().min(1, 'Le prénom est requis').max(100),
  lastName: z.string().min(1, 'Le nom est requis').max(100),
  email: z.string().email('Email invalide'),
});

// Validation pour les contacts de type "Professional"
export const professionalContactSchema = z.object({
  type: z.literal('professional'),
  companyName: z.string().min(1, 'Le nom de l\'entreprise est requis').max(255),
  sirenNumber: z
    .string()
    .length(9, 'Le numéro SIREN doit contenir exactement 9 chiffres')
    .regex(/^\d{9}$/, 'Le numéro SIREN ne doit contenir que des chiffres'),
  email: z.string().email('Email invalide'),
});

// Union des deux types
export const createContactSchema = z.discriminatedUnion('type', [
  individualContactSchema,
  professionalContactSchema,
]);

// Pour la mise à jour, tous les champs sont optionnels sauf le type
export const updateContactSchema = z.discriminatedUnion('type', [
  individualContactSchema.partial().required({ type: true }),
  professionalContactSchema.partial().required({ type: true }),
]);

// Types TypeScript exportés
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;