import { Company } from '@application/entities/Company';
import { ConflictError } from '@application/errors/application/ConflictError';
import { CompanyRepository } from '@infra/database/prisma/repositories/CompanyRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class CreateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(data: CreateCompanyUseCase.Input): Promise<CreateCompanyUseCase.Output> {
    const { name, email, phone, cnpj } = data;

    const existingCompanyByEmail = await this.companyRepository.findByEmail(email);
    if (existingCompanyByEmail) {
      throw new ConflictError('Email already exists');
    }

    const existingCompanyByCNPJ = await this.companyRepository.findByCNPJ(cnpj);
    if (existingCompanyByCNPJ) {
      throw new ConflictError('CNPJ already exists');
    }

    const company = Company.create({
      name,
      email,
      phone,
      cnpj,
    });

    const { id } = await this.companyRepository.create(company);

    return { id };
  }
}

export namespace CreateCompanyUseCase {
  export type Input = {
    name: string;
    email: string;
    phone?: string | null;
    cnpj: string;
  };

  export type Output = {
    id: string;
  };
}
