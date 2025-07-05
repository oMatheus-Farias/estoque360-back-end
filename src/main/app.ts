import 'reflect-metadata';

import { ErrorCode } from '@application/errors/ErrorCode';
import { fastifyCors } from '@fastify/cors';
import { env } from '@shared/env/env';
import { accountRoutes } from '@web/routes/accountRoutes';
import { fastify } from 'fastify';
import { ZodError } from 'zod';

export const app = fastify();

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

// heath check route
app.get('/health', () => {
  return { status: 'ok' };
});

app.register(accountRoutes, {
  prefix: '/accounts',
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: {
        code: ErrorCode.VALIDATION,
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          error: issue.message,
        })),
      },
    });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  reply.status(500).send({ error: { code: ErrorCode.INTERNAL_SERVER_ERROR, message: 'Internal server error' } });
});
