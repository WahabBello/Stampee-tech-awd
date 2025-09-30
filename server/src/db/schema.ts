// backend/src/db/schema.ts
import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';

// Table Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Table Contacts
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  
  // Type de contact: 'individual' ou 'professional'
  type: varchar('type', { length: 20 }).notNull(),
  
  // Champs pour Individual
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  
  // Champs pour Professional
  companyName: varchar('company_name', { length: 255 }),
  sirenNumber: varchar('siren_number', { length: 9 }),
  
  // Champs communs
  email: varchar('email', { length: 255 }).notNull(),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Types TypeScript pour l'utilisation
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;