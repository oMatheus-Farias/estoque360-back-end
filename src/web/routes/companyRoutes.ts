import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CreateCompanyController } from '@web/http/controllers/companies/CreateCompanyController';
import { FindByIdCompanyController } from '@web/http/controllers/companies/FindByIdCompanyController';
import { UpdateCompanyController } from '@web/http/controllers/companies/UpdateCompanyController';
import { verifyJwt } from '@web/middlewares/verifyJwt';
import type { FastifyInstance } from 'fastify';

export async function companyRoutes(app: FastifyInstance) {
  const findByIdCompanyController = Registry.getInstance().resolve(FindByIdCompanyController);
  const createCompanyController = Registry.getInstance().resolve(CreateCompanyController);
  const updateCompanyController = Registry.getInstance().resolve(UpdateCompanyController);

  app.get('/:companyId', { onRequest: [verifyJwt] }, fastifyAdapter(findByIdCompanyController));

  app.post('/', { onRequest: [verifyJwt] }, fastifyAdapter(createCompanyController));

  app.patch('/:companyId', { onRequest: [verifyJwt] }, fastifyAdapter(updateCompanyController));
}
