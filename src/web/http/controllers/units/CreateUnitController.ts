import { CreateUnitUseCase } from '@application/useCases/units/CreateUnitUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { Schema } from '@kermel/decorators/Schema';
import { CreateUnitBody, CreateUnitSchema } from '@web/http/validators/schemas/units/CreateUnitSchema';

@Injectable()
@Schema(CreateUnitSchema)
export class CreateUnitController extends Controller<CreateUnitController.Response> {
  constructor(private readonly createUnitUseCase: CreateUnitUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<CreateUnitBody>): Promise<Controller.Response<CreateUnitController.Response>> {
    const { companyId, name, address, city, state, zipCode, phone } = request.body;

    const { id } = await this.createUnitUseCase.execute({
      companyId,
      name,
      address,
      city,
      state,
      zipCode,
      phone,
    });

    return {
      statusCode: 201,
      body: { id },
    };
  }
}

export namespace CreateUnitController {
  export type Response = {
    id: string;
  };
}
