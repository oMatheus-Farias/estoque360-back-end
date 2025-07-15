import { JWTService } from '@application/services/JWTService';
import { CredentialsAuthUseCase } from '@application/useCases/sessions/CredentialsAuthUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { Schema } from '@kermel/decorators/Schema';
import { CredentialsAuthBody, CredentialsAuthSchema } from '@web/http/validators/schemas/sessions/CredentialsAuthSchema';

@Injectable()
@Schema(CredentialsAuthSchema)
export class CredentialsAuthController extends Controller<CredentialsAuthController.Response> {
  constructor(
    private readonly credentialsAuthUseCase: CredentialsAuthUseCase,
    private readonly jwtService: JWTService,
  ) {
    super();
  }

  protected override async handle(
    request: Controller.Request<CredentialsAuthBody>,
  ): Promise<Controller.Response<CredentialsAuthController.Response>> {
    const { email, password } = request.body;

    const { account, refreshToken } = await this.credentialsAuthUseCase.execute({
      email,
      password,
    });

    const token = await this.jwtService.generateToken({
      accountId: account.id,
      email: account.email,
      role: account.role,
    });

    return {
      statusCode: 200,
      body: {
        token,
        refreshToken,
      },
    };
  }
}

export namespace CredentialsAuthController {
  export type Response = {
    token: string;
    refreshToken: string;
  };
}
