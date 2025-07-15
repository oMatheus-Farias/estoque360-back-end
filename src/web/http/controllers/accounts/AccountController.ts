import { CreateAccountUseCase } from '@application/useCases/accounts/CreateAccountUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { Schema } from '@kermel/decorators/Schema';

import { CreateAccountBody, CreateAccountSchema } from '../../validators/schemas/accounts/CreateAccountSchema';

@Injectable()
@Schema(CreateAccountSchema)
export class CreateAccountController extends Controller<CreateAccountController.Response> {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<CreateAccountBody>): Promise<Controller.Response<CreateAccountController.Response>> {
    // Converte o body para o tipo esperado pelo UseCase
    const inputData: CreateAccountUseCase.Input = {
      email: request.body.email,
      password: request.body.password,
      name: request.body.name,
      role: request.body.role,
      phone: request.body.phone,
      avatar: request.body.avatar,
    };

    const result = await this.createAccountUseCase.execute(inputData);

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace CreateAccountController {
  export type Response = {
    account: {
      id: string;
    };
    profile: {
      id: string;
    };
  };
}
