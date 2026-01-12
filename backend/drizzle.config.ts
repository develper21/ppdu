import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default {
  schema: './src/schema/index.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/ppdu',
  },
  strict: true,
} satisfies Config;
