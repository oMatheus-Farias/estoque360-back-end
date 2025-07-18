import { Company } from '@application/entities/Company';
import type { ICompanyRepository } from '@domain/contracts/repositories/ICompanyRepository';
import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  async findById(id: string): Promise<Company | null> {
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) return null;

    return new Company({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      cnpj: company.cnpj,
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<Company | null> {
    const company = await prisma.company.findUnique({
      where: { email },
    });

    if (!company) return null;

    return new Company({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      cnpj: company.cnpj,
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async findByCNPJ(cnpj: string): Promise<Company | null> {
    const company = await prisma.company.findUnique({
      where: { cnpj },
    });

    if (!company) return null;

    return new Company({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      cnpj: company.cnpj,
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async create(data: Company): Promise<{ id: string }> {
    return await prisma.company.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        cnpj: data.cnpj,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      select: { id: true },
    });
  }

  async update(id: string, data: Company): Promise<void> {
    await prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        status: data.status,
      },
    });
  }
}
