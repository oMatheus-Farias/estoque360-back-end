import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CreateUnitController } from '@web/http/controllers/units/CreateUnitController';
import { verifyJwt } from '@web/middlewares/verifyJwt';
import type { FastifyInstance } from 'fastify';

export async function unitRoutes(app: FastifyInstance) {
  const createUnitController = Registry.getInstance().resolve(CreateUnitController);

  app.post('/', { onRequest: [verifyJwt] }, fastifyAdapter(createUnitController));
}
