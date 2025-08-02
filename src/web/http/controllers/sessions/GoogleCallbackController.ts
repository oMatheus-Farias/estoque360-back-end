import { GoogleCallbackUseCase } from '@application/useCases/sessions/GoogleCallbackUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { env } from '@shared/env/env';

@Injectable()
export class GoogleCallbackController extends Controller<GoogleCallbackController.Response> {
  constructor(private readonly googleCallbackUseCase: GoogleCallbackUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request): Promise<Controller.Response<GoogleCallbackController.Response>> {
    const { code } = request.query;

    if (!code || typeof code !== 'string') {
      throw new Error('Authorization code is required');
    }

    const result = await this.googleCallbackUseCase.execute({ code });

    // Verificar se deve redirecionar para registro
    if ('shouldRedirect' in result) {
      //TODO: Implementar lógica de redirecionamento para registro
      const redirectUrl = `${env.FRONTEND_URL}/auth/sign-in`;

      return {
        statusCode: 302,
        body: {
          redirectUrl,
        },
      };
    }

    // Login bem-sucedido - redirecionar com tokens
    const redirectUrl = `${env.FRONTEND_URL}/auth/google/callback?token=${result.token}&refreshToken=${result.refreshToken}`;

    return {
      statusCode: 302,
      body: {
        redirectUrl,
      },
    };
  }
}

export namespace GoogleCallbackController {
  export type Response = {
    redirectUrl: string;
  };
}
