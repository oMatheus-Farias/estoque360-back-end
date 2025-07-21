import type { Profile } from '@application/entities/Profile';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export abstract class IProfileRepository {
  abstract findByAccountId(accountId: string): Promise<Profile | null>;
  abstract create(profile: Profile): Promise<void>;
  abstract update(id: string, data: Partial<Profile.CreateData>): Promise<Profile>;
}
