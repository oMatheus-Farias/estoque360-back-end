import 'reflect-metadata';

import { ErrorCode } from '@application/errors/ErrorCode';
import { fastifyCors } from '@fastify/cors';
// import fastifyPassport from '@fastify/passport';
// import { prisma } from '@infra/clients/prismaClient';
import { env } from '@shared/env/env';
import { accountRoutes } from '@web/routes/accountRoutes';
import { fastify } from 'fastify';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ZodError } from 'zod';

export const app = fastify();

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

// fastifyPassport.use(
//   'google',
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await prisma.user.findUnique({
//           where: { googleId: profile.id },
//         });

//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               email: profile.emails?.[0].value || '',
//               name: profile.displayName,
//               googleId: profile.id,
//               picture: profile.photos?.[0].value,
//             },
//           });
//         }

//         done(null, user);
//       } catch (err) {
//         done(err as any, undefined);
//       }
//     },
//   ),
// );

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
