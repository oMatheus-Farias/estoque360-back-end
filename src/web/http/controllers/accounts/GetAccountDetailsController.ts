import { GetAccountDetailsUseCase } from '@application/useCases/accounts/GetAccountDetailsUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class GetAccountDetailsController extends Controller<GetAccountDetailsController.Response> {
  constructor(private readonly getAccountDetailsUseCase: GetAccountDetailsUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request): Promise<Controller.Response<GetAccountDetailsController.Response>> {
    const { accountId } = request.user;

    const accountDetails = await this.getAccountDetailsUseCase.execute({
      accountId,
    });

    return {
      statusCode: 200,
      body: accountDetails,
    };
  }
}

export namespace GetAccountDetailsController {
  export type Response = {
    account: {
      id: string;
      email: string;
      googleId: string | null;
      role: string;
      status: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    profile: {
      id: string;
      name: string;
      phone: string | null;
      avatar: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}
