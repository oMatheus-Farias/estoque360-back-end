import { CreateCompanyUseCase } from '@application/useCases/companies/CreateCompanyUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { Schema } from '@kermel/decorators/Schema';
import { CreateCompanyBody, CreateCompanySchema } from '@web/http/validators/schemas/companies/CreateCompanySchema';

@Injectable()
@Schema(CreateCompanySchema)
export class CreateCompanyController extends Controller<CreateCompanyController.Response> {
  constructor(private readonly createCompanyUseCase: CreateCompanyUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<CreateCompanyBody>): Promise<Controller.Response<CreateCompanyController.Response>> {
    const { name, email, phone, cnpj } = request.body;

    const { id } = await this.createCompanyUseCase.execute({
      name,
      email,
      phone,
      cnpj,
    });

    return {
      statusCode: 201,
      body: { id },
    };
  }
}

export namespace CreateCompanyController {
  export type Response = {
    id: string;
  };
}
