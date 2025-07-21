import { UpdateUnitUseCase } from '@application/useCases/units/UpdateUnitUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { Schema } from '@kermel/decorators/Schema';
import { UpdateUnitBody, UpdateUnitSchema, UpdateUnitSchemaWithId } from '@web/http/validators/schemas/units/UpdateUnitSchema';

type Param = {
  param: {
    unitId: string;
  };
};

@Injectable()
@Schema(UpdateUnitSchema)
export class UpdateUnitController extends Controller<UpdateUnitController.Response> {
  constructor(private readonly updateUnitUseCase: UpdateUnitUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<UpdateUnitBody>): Promise<Controller.Response<UpdateUnitController.Response>> {
    const { unitId } = request.params as Param['param'];
    const { name, address, city, state, zipCode, phone } = request.body;

    await UpdateUnitSchemaWithId.parseAsync({ unitId });

    const { id } = await this.updateUnitUseCase.execute({
      id: unitId,
      name,
      address,
      city,
      state,
      zipCode,
      phone: phone || null,
    });

    return {
      statusCode: 200,
      body: { id },
    };
  }
}

export namespace UpdateUnitController {
  export type Response = {
    id: string;
  };
}
