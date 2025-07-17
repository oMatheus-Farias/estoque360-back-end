import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CredentialsAuthController } from '@web/http/controllers/sessions/CredentialsAuthController';
import { SignOutController } from '@web/http/controllers/sessions/SignOutController';
import { verifyJwt } from '@web/middlewares/verifyJwt';
import type { FastifyInstance } from 'fastify';

export async function sessionRoutes(app: FastifyInstance) {
  const credentialsAuthController = Registry.getInstance().resolve(CredentialsAuthController);
  const signOutController = Registry.getInstance().resolve(SignOutController);
  app.post('/credentials', fastifyAdapter(credentialsAuthController));
  app.post('/sign-out', { onRequest: [verifyJwt] }, fastifyAdapter(signOutController));
}
