import { ConflictError } from '@application/errors/application/ConflictError';
import { UnitRepository } from '@infra/database/prisma/repositories/UnitRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class UpdateUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(data: UpdateUnitUseCase.Input): Promise<UpdateUnitUseCase.Output> {
    const { id, name, address, city, state, zipCode, phone, status } = data;

    const unit = await this.unitRepository.findById(id);
    if (!unit) {
      throw new ConflictError('Unit not found');
    }

    const updateData = {
      ...(name !== undefined && { name }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(zipCode !== undefined && { zipCode }),
      ...(phone !== undefined && { phone }),
      ...(status !== undefined && { status }),
    };

    const { id: unitUpdatedId } = await this.unitRepository.update(id, updateData);

    return { id: unitUpdatedId };
  }
}

export namespace UpdateUnitUseCase {
  export type Input = {
    id: string;
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string | null;
    status?: boolean;
  };

  export type Output = {
    id: string;
  };
}
