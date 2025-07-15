import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CredentialsAuthController } from '@web/http/controllers/sessions/CredentialsAuthController';
import type { FastifyInstance } from 'fastify';

export async function sessionRoutes(app: FastifyInstance) {
  const credentialsAuthController = Registry.getInstance().resolve(CredentialsAuthController);
  app.post('/credentials', fastifyAdapter(credentialsAuthController));
}
