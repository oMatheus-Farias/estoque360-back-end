import type { Company } from '@application/entities/Company';

export abstract class ICompanyRepository {
  abstract findById(id: string): Promise<Company | null>;
  abstract findByEmail(email: string): Promise<Company | null>;
  abstract findByCNPJ(cnpj: string): Promise<Company | null>;
  abstract create(data: Company): Promise<{ id: string }>;
  abstract update(id: string, data: Company): Promise<void>;
}
