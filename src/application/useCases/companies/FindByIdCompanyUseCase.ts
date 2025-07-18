import { Company } from '@application/entities/Company';
import { ConflictError } from '@application/errors/application/ConflictError';
import { CompanyRepository } from '@infra/database/prisma/repositories/CompanyRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class FindByIdCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(data: FindByIdCompanyUseCase.Input): Promise<FindByIdCompanyUseCase.Output> {
    const { id } = data;

    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new ConflictError('Company not found');
    }

    return { company };
  }
}

export namespace FindByIdCompanyUseCase {
  export type Input = {
    id: string;
  };

  export type Output = {
    company: Company | null;
  };
}
