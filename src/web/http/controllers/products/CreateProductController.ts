import { CreateProductUseCase } from '@application/useCases/products/CreateProductUseCase';
import { Controller } from '@domain/contracts/Controller';
import { Injectable } from '@kermel/decorators/Injectable';
import { Schema } from '@kermel/decorators/Schema';
import { CreateProductBody, CreateProductSchema } from '@web/http/validators/schemas/products/CreateProductSchema';

@Injectable()
@Schema(CreateProductSchema)
export class CreateProductController extends Controller<CreateProductController.Response> {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {
    super();
  }

  protected override async handle(request: Controller.Request<CreateProductBody>): Promise<Controller.Response<CreateProductController.Response>> {
    const { companyId, name, description, priceCost, priceSale, minimumStock } = request.body;

    const { id } = await this.createProductUseCase.execute({
      companyId,
      name,
      description,
      priceCost,
      priceSale,
      minimumStock,
    });

    return {
      statusCode: 201,
      body: { id },
    };
  }
}

export namespace CreateProductController {
  export type Response = {
    id: string;
  };
}
