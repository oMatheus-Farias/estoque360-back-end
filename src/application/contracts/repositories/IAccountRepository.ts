import { Account } from '@application/entities/Account';
import { Profile } from '@application/entities/Profile';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export abstract class IAccountRepository {
  abstract findById(id: string): Promise<Account | null>;
  abstract findByEmail(email: string): Promise<Account | null>;
  abstract createWithProfile(account: Account, profile: Profile): Promise<void>;
}
