import 'reflect-metadata';

import { ErrorCode } from '@application/errors/ErrorCode';
import { fastifyCors } from '@fastify/cors';
import { fastifyJwt } from '@fastify/jwt';
import { env } from '@shared/env/env';
import { accountRoutes } from '@web/routes/accountRoutes';
import { authTestRoutes } from '@web/routes/authTestRoutes';
import { refreshTokenRoutes } from '@web/routes/refreshTokenRoutes';
import { sessionRoutes } from '@web/routes/sessionRoutes';
import { fastify } from 'fastify';
import { ZodError } from 'zod';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
app.register(fastifyCors, {
  origin: env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
});

app.get('/health', () => {
  return { status: 'ok' };
});
app.register(authTestRoutes, {
  prefix: '/test',
});
app.register(sessionRoutes, {
  prefix: '/sessions',
});
app.register(accountRoutes, {
  prefix: '/accounts',
});
app.register(refreshTokenRoutes, {
  prefix: '/refresh-tokens',
});

// Simplified Google OAuth redirect (for testing purposes)
app.get('/auth/google', async (req, reply) => {
  const googleAuthUrl =
    `https://accounts.google.com/oauth2/auth?` +
    `client_id=${env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(env.GOOGLE_CALLBACK_URL)}&` +
    `response_type=code&` +
    `scope=profile email`;

  reply.redirect(googleAuthUrl);
});

app.setErrorHandler((error, req, reply) => {
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

  reply.status(500).send({
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    },
  });
});
