import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CreateCompanyController } from '@web/http/controllers/companies/CreateCompanyController';
import { UpdateCompanyController } from '@web/http/controllers/companies/UpdateCompanyController';
import { verifyJwt } from '@web/middlewares/verifyJwt';
import type { FastifyInstance } from 'fastify';

export async function companyRoutes(app: FastifyInstance) {
  const createCompanyController = Registry.getInstance().resolve(CreateCompanyController);
  const updateCompanyController = Registry.getInstance().resolve(UpdateCompanyController);

  app.post('/', { onRequest: [verifyJwt] }, fastifyAdapter(createCompanyController));

  app.patch('/:companyId', { onRequest: [verifyJwt] }, fastifyAdapter(updateCompanyController));
}
