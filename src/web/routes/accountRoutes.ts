import { Registry } from '@kermel/di/Registry';
import { fastifyAdapter } from '@web/adapters/fastifyAdapters';
import { CreateAccountController } from '@web/http/controllers/accounts/AccountController';
import type { FastifyInstance } from 'fastify';

export async function accountRoutes(app: FastifyInstance) {
  const createAccountController = Registry.getInstance().resolve(CreateAccountController);
  app.post('/', fastifyAdapter(createAccountController));
}
