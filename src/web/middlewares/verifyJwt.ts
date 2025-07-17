import type { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  }
}
