import { ApplicationError } from '@application/errors/application/ApplicationError';
import { HttpError } from '@application/errors/http/HttpError';
import { Controller } from '@domain/contracts/Controller';
import { env } from '@shared/env/env';
import { errorResponse } from '@shared/utils/ErrorResponse';
import type { FastifyReply, FastifyRequest } from 'fastify';

export function fastifyAdapter<TBody = any>(controller: Controller<TBody>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const controllerRequest: Controller.Request = {
        body: (request.body ?? {}) as Record<string, unknown>,
        params: (request.params ?? {}) as Record<string, unknown>,
        query: (request.query ?? {}) as Record<string, unknown>,
        headers: (request.headers ?? {}) as Record<string, unknown>,
        user: request.user || { accountId: '', email: '', role: '' },
        payload: request.user || { accountId: '', email: '', role: '' },
      };

      const response = await controller.execute(controllerRequest);

      reply.status(response.statusCode);

      // Tratar redirecionamentos
      if (response.statusCode === 302 && response.body && typeof response.body === 'object' && 'redirectUrl' in response.body) {
        return reply.redirect(response.body.redirectUrl as string);
      }

      return reply.send(response.body);
    } catch (error) {
      if (env.NODE_ENV !== 'production') {
        console.error(error);
      }
      if (error instanceof HttpError) {
        reply.status(error.statusCode);
        return errorResponse(error);
      }
      if (error instanceof ApplicationError) {
        reply.status(error.statusCode ?? 400);
        return errorResponse({
          message: error.message,
          code: error.code,
          statusCode: error.statusCode ?? 400,
        });
      }

      throw error;
    }
  };
}
