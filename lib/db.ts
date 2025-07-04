import Redis from 'ioredis';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as surveyResponses from '@/lib/schema/survey';

// --- Redis Client (for caching, etc.) ---
if (!process.env.KV_URL) {
  throw new Error('KV_URL is not defined in .env.local');
}

// Export the Redis instance for use in API routes
export const redis = new Redis(process.env.KV_URL);

// --- PostgreSQL Client (for primary data) ---
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not defined in .env.local');
}

const client = postgres(process.env.POSTGRES_URL);

// Export the Drizzle instance for use in API routes
export const db = drizzle(client, {
  schema: {
    ...surveyResponses,
  },
});
