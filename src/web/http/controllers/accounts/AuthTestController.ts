import { JWTService } from '@application/services/JWTService';
import { GoogleOAuthUseCase } from '@application/useCases/sessions/GoogleOAuthUseCase';
import { Injectable } from '@kermel/decorators/Injectable';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AuthTestController {
  constructor(
    private readonly googleOAuthUseCase: GoogleOAuthUseCase,
    private readonly jwtService: JWTService,
  ) {}

  // Simula o callback do Google OAuth para testes
  async simulateGoogleCallback(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = req.body as {
        googleId: string;
        email: string;
        name: string;
        avatar?: string;
      };

      // Valida os dados obrigatórios
      if (!body.googleId || !body.email || !body.name) {
        return reply.status(400).send({
          error: 'Missing required fields: googleId, email, name',
          received: body,
        });
      }

      // Executa o UseCase
      const result = await this.googleOAuthUseCase.execute({
        googleId: body.googleId,
        email: body.email,
        name: body.name,
        avatar: body.avatar,
      });

      // Gera o JWT
      const token = await this.jwtService.generateToken({
        accountId: result.account.id,
        email: result.account.email,
        role: result.account.role,
      });

      return reply.send({
        success: true,
        message: result.account.isNew ? 'New account created' : 'Existing account found',
        data: {
          account: result.account,
          token,
          instructions: {
            usage: 'Use this token in Authorization header: Bearer <token>',
            example: `Authorization: Bearer ${token}`,
          },
        },
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Testa a validação do JWT
  async validateToken(req: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({
          error: 'Missing or invalid Authorization header',
          expected: 'Authorization: Bearer <token>',
        });
      }

      const token = authHeader.split(' ')[1];
      const payload = await this.jwtService.verifyToken(token);

      return reply.send({
        success: true,
        message: 'Token is valid',
        data: {
          accountId: payload.accountId,
          email: payload.email,
          role: payload.role,
        },
      });
    } catch (error) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid or expired token',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Endpoint para testar criação de conta normal
  async testCreateAccount(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as any;

    return reply.send({
      message: 'Test endpoint for account creation',
      receivedData: body,
      instructions: {
        url: '/accounts',
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          role: 'COLLABORATOR',
          phone: '+55 11 99999-9999',
          avatar: 'https://example.com/avatar.jpg',
        },
      },
    });
  }
}
