import { fastifyAdapter } from '@application/adapters/fastifyAdapters';
import { Registry } from '@kermel/di/Registry';
import { CreateRefreshTokenController } from '@web/http/controllers/refreshTokens/CreateRefreshTokenController';
import type { FastifyInstance } from 'fastify';

export async function refreshTokenRoutes(app: FastifyInstance) {
  const createRefreshTokenController = Registry.getInstance().resolve(CreateRefreshTokenController);
  app.post('/', fastifyAdapter(createRefreshTokenController));
}
