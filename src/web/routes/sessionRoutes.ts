import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CredentialsAuthController } from '@web/http/controllers/sessions/CredentialsAuthController';
import { GoogleAuthController } from '@web/http/controllers/sessions/GoogleAuthController';
import { GoogleCallbackController } from '@web/http/controllers/sessions/GoogleCallbackController';
import { SignOutController } from '@web/http/controllers/sessions/SignOutController';
import { verifyJwt } from '@web/middlewares/verifyJwt';
import type { FastifyInstance } from 'fastify';

export async function sessionRoutes(app: FastifyInstance) {
  const registry = Registry.getInstance();
  const credentialsAuthController = registry.resolve(CredentialsAuthController);
  const signOutController = registry.resolve(SignOutController);
  const googleAuthController = registry.resolve(GoogleAuthController);
  const googleCallbackController = registry.resolve(GoogleCallbackController);

  app.post('/credentials', fastifyAdapter(credentialsAuthController));

  app.post('/sign-out', { onRequest: [verifyJwt] }, fastifyAdapter(signOutController));

  // Google OAuth - Iniciar autenticação
  app.get('/google', fastifyAdapter(googleAuthController));

  // Google OAuth - Callback
  app.get('/google/callback', fastifyAdapter(googleCallbackController));
}
