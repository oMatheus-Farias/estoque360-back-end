import { Unit } from '@application/entities/Unit';
import { ConflictError } from '@application/errors/application/ConflictError';
import { CompanyRepository } from '@infra/database/prisma/repositories/CompanyRepository';
import { UnitRepository } from '@infra/database/prisma/repositories/UnitRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class CreateUnitUseCase {
  constructor(
    private readonly unitRepository: UnitRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(data: CreateUnitUseCase.Input): Promise<CreateUnitUseCase.Output> {
    const { companyId, name, address, city, state, zipCode, phone } = data;

    const existingCompany = await this.companyRepository.findById(companyId);
    if (!existingCompany) {
      throw new ConflictError('Company not found');
    }

    const unit = Unit.create({
      companyId,
      name,
      address,
      city,
      state,
      zipCode,
      phone,
    });

    const { id } = await this.unitRepository.create(unit);

    return { id };
  }
}

export namespace CreateUnitUseCase {
  export type Input = {
    companyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string | null;
  };

  export type Output = {
    id: string;
  };
}
