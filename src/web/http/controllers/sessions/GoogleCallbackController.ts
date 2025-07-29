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

    const { token, refreshToken } = await this.googleCallbackUseCase.execute({ code });

    // Retornar dados de redirecionamento para o frontend
    const redirectUrl = `${env.FRONTEND_URL}/auth/google/callback?token=${token}&refreshToken=${refreshToken}`;

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
