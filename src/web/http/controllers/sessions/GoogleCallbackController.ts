import { GoogleCallbackUseCase } from '@application/useCases/sessions/GoogleCallbackUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';

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

    const result = await this.googleCallbackUseCase.execute({
      code,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace GoogleCallbackController {
  export type Response = {
    token: string;
    account: {
      id: string;
      email: string;
      role: string;
      isNew: boolean;
    };
  };
}
