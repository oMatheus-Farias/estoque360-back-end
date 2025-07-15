import { JWTService } from '@application/services/JWTService';
import { CreateRefreshTokenUseCase } from '@application/useCases/refreshTokens/CreateRefreshTokenUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { Schema } from '@kermel/decorators/Schema';
import { CreateRefreshTokenBody, CreateRefreshTokenSchema } from '@web/http/validators/schemas/refreshTokens/CreateRefreshTokenSchema';

@Injectable()
@Schema(CreateRefreshTokenSchema)
export class CreateRefreshTokenController extends Controller<CreateRefreshTokenController.Response> {
  constructor(
    private readonly createRefreshTokenUseCase: CreateRefreshTokenUseCase,
    private readonly jwtService: JWTService,
  ) {
    super();
  }

  protected override async handle(
    request: Controller.Request<CreateRefreshTokenBody>,
  ): Promise<Controller.Response<CreateRefreshTokenController.Response>> {
    const { refreshToken, account } = await this.createRefreshTokenUseCase.execute({
      refreshToken: request.body.refreshToken,
    });

    const token = await this.jwtService.generateToken(
      {
        accountId: account.id,
        email: account.email,
        role: account.role,
      },
      '1d',
    );

    return {
      statusCode: 201,
      body: {
        token,
        refreshToken,
      },
    };
  }
}

export namespace CreateRefreshTokenController {
  export type Response = {
    token: string;
    refreshToken: string;
  };
}
