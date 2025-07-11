import { Account } from '@application/entities/Account';
import { Profile } from '@application/entities/Profile';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export abstract class IAccountRepository {
  abstract findById(id: string): Promise<Account | null>;
  abstract findByEmail(email: string): Promise<Account | null>;
  abstract findByGoogleId(googleId: string): Promise<Account | null>;
  abstract createWithProfile(account: Account, profile: Profile): Promise<void>;
  abstract createGoogleAccount(googleData: { email: string; googleId: string; name: string; avatar?: string }): Promise<Account>;
}
