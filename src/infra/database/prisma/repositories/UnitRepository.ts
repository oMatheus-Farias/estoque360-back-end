import { Unit } from '@application/entities/Unit';
import type { IUnitRepository } from '@domain/contracts/repositories/IUnitRepository';
import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class UnitRepository implements IUnitRepository {
  async findById(id: string): Promise<Unit | null> {
    const unit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) return null;

    return new Unit({
      id: unit.id,
      companyId: unit.companyId,
      name: unit.name,
      address: unit.address,
      city: unit.city,
      state: unit.state,
      zipCode: unit.zipCode,
      phone: unit.phone,
      status: unit.status,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt,
    });
  }

  async create(data: Unit): Promise<{ id: string }> {
    const unit = await prisma.unit.create({
      data: {
        id: data.id,
        companyId: data.companyId,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
        status: data.status,
      },
    });

    return { id: unit.id };
  }

  async update(
    id: string,
    data: Partial<Pick<Unit, 'name' | 'address' | 'city' | 'state' | 'zipCode' | 'phone' | 'status'>>,
  ): Promise<{ id: string }> {
    const unit = await prisma.unit.update({
      where: { id },
      data,
    });

    return { id: unit.id };
  }
}
