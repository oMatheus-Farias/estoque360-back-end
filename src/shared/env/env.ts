import 'dotenv/config';

import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'homolog', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1),
});

export const env = schema.parse(process.env);
