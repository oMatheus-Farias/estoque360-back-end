import { Registry } from '@kermel/di/Registry';
import { AuthTestController } from '@web/http/controllers/AuthTestController';
import { FastifyInstance } from 'fastify';

export async function authTestRoutes(app: FastifyInstance) {
  const registry = Registry.getInstance();
  const authTestController = registry.resolve(AuthTestController);

  // Simula o callback do Google OAuth
  app.post('/test/auth/google-callback', async (request, reply) => {
    return authTestController.simulateGoogleCallback(request, reply);
  });

  // Testa validação de JWT
  app.get('/test/auth/validate-token', async (request, reply) => {
    return authTestController.validateToken(request, reply);
  });

  // Helper para teste de criação de conta
  app.get('/test/auth/create-account-example', async (request, reply) => {
    return authTestController.testCreateAccount(request, reply);
  });

  // Endpoint de informações sobre os testes
  app.get('/test/auth/info', async (request, reply) => {
    return reply.send({
      message: 'Auth Test Endpoints',
      endpoints: [
        {
          method: 'POST',
          path: '/test/auth/google-callback',
          description: 'Simula o callback do Google OAuth',
          body: {
            googleId: 'string (required)',
            email: 'string (required)',
            name: 'string (required)',
            avatar: 'string (optional)',
          },
          example: {
            googleId: '123456789',
            email: 'user@gmail.com',
            name: 'John Doe',
            avatar: 'https://lh3.googleusercontent.com/a/photo.jpg',
          },
        },
        {
          method: 'GET',
          path: '/test/auth/validate-token',
          description: 'Valida um JWT token',
          headers: {
            Authorization: 'Bearer <token>',
          },
        },
        {
          method: 'POST',
          path: '/accounts',
          description: 'Cria conta com email/senha',
          body: {
            email: 'string (required)',
            password: 'string (required)',
            name: 'string (required)',
            role: 'ADMIN | MANAGER | COLLABORATOR (optional)',
            phone: 'string (optional)',
            avatar: 'string (optional)',
          },
        },
        {
          method: 'GET',
          path: '/profile',
          description: 'Busca perfil do usuário logado',
          headers: {
            Authorization: 'Bearer <token>',
          },
        },
      ],
      oauth_flow: {
        production: [
          '1. GET /auth/google - Redireciona para Google',
          '2. User autoriza no Google',
          '3. Google redireciona para /auth/google/callback',
          '4. Backend gera JWT e redireciona para frontend',
        ],
        testing: ['1. POST /test/auth/google-callback - Simula dados do Google', '2. Recebe JWT no response', '3. Usa JWT em endpoints protegidos'],
      },
    });
  });
}
