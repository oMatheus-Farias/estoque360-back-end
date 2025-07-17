import { SignOutUseCase } from '@application/useCases/sessions/SignOutUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { SignOutBody, SignOutSchema } from '@web/http/validators/schemas/sessions/SignOutSchema';

@Injectable()
export class SignOutController extends Controller<SigOutController.Response> {
  constructor(private readonly signOutUseCase: SignOutUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<SignOutBody>): Promise<Controller.Response<SigOutController.Response>> {
    const { accountId } = request.payload;

    await SignOutSchema.parseAsync({ accountId });

    await this.signOutUseCase.execute({
      accountId,
    });

    return {
      statusCode: 204,
      body: undefined,
    };
  }
}

export namespace SigOutController {
  export type Response = void;
}
