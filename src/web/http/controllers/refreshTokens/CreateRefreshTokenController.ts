import { CreateRefreshTokenUseCase } from '@application/useCases/refreshTokens/CreateRefreshTokenUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class CreateRefreshTokenController extends Controller<CreateRefreshTokenController.Response> {
  constructor(private readonly createRefreshTokenUseCase: CreateRefreshTokenUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<any>): Promise<Controller.Response<CreateRefreshTokenController.Response>> {
    //TODO: Cntinue...
    const result = await this.createRefreshTokenUseCase.execute({
      id: request.body.id,
    });

    return {
      statusCode: 200,
      body: {
        refreshToken: result.refreshToken,
      },
    };
  }
}

export namespace CreateRefreshTokenController {
  export type Response = {
    refreshToken: string;
  };
}
