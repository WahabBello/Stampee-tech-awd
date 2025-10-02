import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

// Pool de connexions PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialiser Drizzle avec le pool
export const db = drizzle(pool, { schema });

// Fonction pour tester la connexion
export async function testConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Fonction pour fermer la connexion (utile pour les tests)
export async function closeConnection() {
  await pool.end();
}