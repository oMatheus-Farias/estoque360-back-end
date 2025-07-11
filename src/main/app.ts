import 'reflect-metadata';

import { ErrorCode } from '@application/errors/ErrorCode';
import { JWTService } from '@application/services/JWTService';
import { GoogleOAuthUseCase } from '@application/useCases/GoogleOAuthUseCase';
import { fastifyCors } from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import fastifyPassport from '@fastify/passport';
import { Registry } from '@kermel/di/Registry';
import { env } from '@shared/env/env';
import { accountRoutes } from '@web/routes/accountRoutes';
import { fastify } from 'fastify';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ZodError } from 'zod';

export const app = fastify();

// Register JWT
app.register(fastifyJWT, {
  secret: env.JWT_SECRET,
});

app.register(fastifyCors, {
  origin: env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
});

// Register Passport
app.register(fastifyPassport.initialize());

// Configuração do Google OAuth Strategy
fastifyPassport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Validação dos dados do Google
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        if (!email || !name) {
          return done(new Error('Missing required profile information'), undefined);
        }

        // Usa o UseCase para processar o login
        const registry = Registry.getInstance();
        const googleOAuthUseCase = registry.resolve(GoogleOAuthUseCase);

        const result = await googleOAuthUseCase.execute({
          googleId: profile.id,
          email,
          name,
          avatar,
        });

        done(null, result.account);
      } catch (error) {
        done(error as Error, undefined);
      }
    },
  ),
);

// Serialize/Deserialize user for session
fastifyPassport.registerUserSerializer(async (user: any) => user.id);
fastifyPassport.registerUserDeserializer(async (id: string) => ({ id }));

// Health check route
app.get('/health', () => {
  return { status: 'ok' };
});

// Register routes
app.register(accountRoutes, {
  prefix: '/accounts',
});

// Google OAuth routes
app.get(
  '/auth/google',
  {
    preValidation: fastifyPassport.authenticate('google', {
      scope: ['profile', 'email'],
    }),
  },
  async () => {
    // This will never be called as it redirects to Google
  },
);

app.get(
  '/auth/google/callback',
  {
    preValidation: fastifyPassport.authenticate('google', {
      failureRedirect: `${env.FRONTEND_URL}/login?error=oauth_failed`,
    }),
  },
  async (req, reply) => {
    try {
      const user = req.user as any;

      if (!user) {
        return reply.redirect(`${env.FRONTEND_URL}/login?error=no_user`);
      }

      // Generate JWT token
      const jwtService = Registry.getInstance().resolve(JWTService);
      const token = await jwtService.generateToken({
        accountId: user.id,
        email: user.email,
        role: user.role,
      });

      // Redirect to frontend with token
      reply.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}&new=${user.isNew || false}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      reply.redirect(`${env.FRONTEND_URL}/login?error=callback_failed`);
    }
  },
);

// Profile route (protected)
app.get('/profile', async (req, reply) => {
  try {
    await req.jwtVerify();
    const user = req.user as { accountId: string; email: string; role: string };

    reply.send({
      id: user.accountId,
      email: user.email,
      role: user.role,
    });
  } catch {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Error handler
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
