import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CreateCompanyController } from '@web/http/controllers/companies/CreateCompanyController';
import { verifyJwt } from '@web/middlewares/verifyJwt';
import type { FastifyInstance } from 'fastify';

export async function companyRoutes(app: FastifyInstance) {
  const createCompanyController = Registry.getInstance().resolve(CreateCompanyController);
  app.post('/', { onRequest: [verifyJwt] }, fastifyAdapter(createCompanyController));
}
