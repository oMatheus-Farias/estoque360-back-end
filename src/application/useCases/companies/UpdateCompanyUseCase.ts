import { ConflictError } from '@application/errors/application/ConflictError';
import { CompanyRepository } from '@infra/database/prisma/repositories/CompanyRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class UpdateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(data: UpdateCompanyUseCase.Input): Promise<UpdateCompanyUseCase.Output> {
    const { id, name, phone, status } = data;

    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new ConflictError('Company not found');
    }

    const updateData = {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(status !== undefined && { status }),
    };

    const { id: companyUpdatedId } = await this.companyRepository.update(id, updateData);

    return { id: companyUpdatedId };
  }
}

export namespace UpdateCompanyUseCase {
  export type Input = {
    id: string;
    name?: string;
    phone?: string | null;
    status?: boolean;
  };

  export type Output = {
    id: string;
  };
}
