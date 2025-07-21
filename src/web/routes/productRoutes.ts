import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CreateProductController } from '@web/http/controllers/products/CreateProductController';
import { verifyJwt } from '@web/middlewares/verifyJwt';
import type { FastifyInstance } from 'fastify';

export async function productRoutes(app: FastifyInstance) {
  const createProductController = Registry.getInstance().resolve(CreateProductController);

  app.post('/', { onRequest: [verifyJwt] }, fastifyAdapter(createProductController));
}
