import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CreateAccountController } from '@web/http/controllers/accounts/AccountController';
import { GetAccountDetailsController } from '@web/http/controllers/accounts/GetAccountDetailsController';
import { verifyJwt } from '@web/middlewares/verifyJwt';
import type { FastifyInstance } from 'fastify';

export async function accountRoutes(app: FastifyInstance) {
  const registry = Registry.getInstance();
  const createAccountController = registry.resolve(CreateAccountController);
  const getAccountDetailsController = registry.resolve(GetAccountDetailsController);

  app.post('/', fastifyAdapter(createAccountController));

  app.get(
    '/me',
    {
      onRequest: [verifyJwt],
    },
    fastifyAdapter(getAccountDetailsController),
  );
}
