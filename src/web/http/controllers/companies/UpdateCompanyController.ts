import { UpdateCompanyUseCase } from '@application/useCases/companies/UpdateCompanyUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { Schema } from '@kermel/decorators/Schema';
import { UpdateCompanyBody, UpdateCompanySchema, UpdateCompanySchemaWithId } from '@web/http/validators/schemas/companies/UpdateCompanySchema';

type Param = {
  param: {
    companyId: string;
  };
};

@Injectable()
@Schema(UpdateCompanySchema)
export class UpdateCompanyController extends Controller<UpdateCompanyController.Response> {
  constructor(private readonly updateCompanyUseCase: UpdateCompanyUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<UpdateCompanyBody>): Promise<Controller.Response<UpdateCompanyController.Response>> {
    const { companyId } = request.params as Param['param'];
    const { name, phone, status } = request.body;

    await UpdateCompanySchemaWithId.parseAsync({ companyId });

    const { id: companyUpdatedId } = await this.updateCompanyUseCase.execute({
      id: companyId,
      name,
      phone,
      status,
    });

    return {
      statusCode: 200,
      body: { id: companyUpdatedId },
    };
  }
}

export namespace UpdateCompanyController {
  export type Response = {
    id: string;
  };
}
