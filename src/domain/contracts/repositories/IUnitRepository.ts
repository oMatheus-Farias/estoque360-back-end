import type { Unit } from '@application/entities/Unit';

export abstract class IUnitRepository {
  abstract findById(id: string): Promise<Unit | null>;
  abstract create(data: Unit): Promise<{ id: string }>;
  abstract update(
    id: string,
    data: Partial<Pick<Unit, 'name' | 'address' | 'city' | 'state' | 'zipCode' | 'phone' | 'status'>>,
  ): Promise<{ id: string }>;
}
