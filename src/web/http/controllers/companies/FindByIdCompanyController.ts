import { Company } from '@application/entities/Company';
import { FindByIdCompanyUseCase } from '@application/useCases/companies/FindByIdCompanyUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { FindByIdCompanySchema } from '@web/http/validators/schemas/companies/FindByIdCompanySchema copy';

type Param = {
  param: {
    companyId: string;
  };
};

@Injectable()
export class FindByIdCompanyController extends Controller<FindByIdCompanyController.Response> {
  constructor(private readonly findByIdCompanyUseCase: FindByIdCompanyUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request): Promise<Controller.Response<FindByIdCompanyController.Response>> {
    const { companyId } = request.params as Param['param'];

    await FindByIdCompanySchema.parseAsync({ companyId });

    const company = await this.findByIdCompanyUseCase.execute({ id: companyId });

    return {
      statusCode: 200,
      body: company,
    };
  }
}

export namespace FindByIdCompanyController {
  export type Response = {
    company: Company | null;
  };
}
