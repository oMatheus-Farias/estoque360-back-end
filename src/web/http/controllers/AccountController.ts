import { CreateAccountUseCase } from '@application/use-cases/CreateAccountUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { Schema } from '@kermel/decorators/Schema';
import { CreateAccountWithProfileOutput } from '@shared/types/account/AccountService';

import { CreateAccountBody, CreateAccountSchema } from '../validators/schemas/CreateAccountSchema';

@Injectable()
@Schema(CreateAccountSchema)
export class CreateAccountController extends Controller<CreateAccountController.Response> {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<CreateAccountBody>): Promise<Controller.Response<CreateAccountController.Response>> {
    const result = await this.createAccountUseCase.execute(request.body);

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace CreateAccountController {
  export type Response = CreateAccountWithProfileOutput;
}
