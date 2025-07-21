import { Product } from '@application/entities/Product';
import { ConflictError } from '@application/errors/application/ConflictError';
import { CompanyRepository } from '@infra/database/prisma/repositories/CompanyRepository';
import { ProductRepository } from '@infra/database/prisma/repositories/ProductRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(data: CreateProductUseCase.Input): Promise<CreateProductUseCase.Output> {
    const { companyId, name, description, priceCost, priceSale, minimumStock } = data;

    const existingCompany = await this.companyRepository.findById(companyId);
    if (!existingCompany) {
      throw new ConflictError('Company not found');
    }

    const product = Product.create({
      companyId,
      name,
      description,
      priceCost,
      priceSale,
      minimumStock,
    });

    const { id } = await this.productRepository.create(product);

    return { id };
  }
}

export namespace CreateProductUseCase {
  export type Input = {
    companyId: string;
    name: string;
    description?: string | null;
    priceCost: number;
    priceSale: number;
    minimumStock: number;
  };

  export type Output = {
    id: string;
  };
}
