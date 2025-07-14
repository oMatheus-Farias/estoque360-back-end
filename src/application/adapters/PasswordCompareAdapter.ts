import type { IPasswordCompare } from '@domain/contracts/adapters/IPasswordCompare';
import { Injectable } from '@kermel/decorators/Injectable';
import { compare } from 'bcryptjs';

@Injectable()
export class PasswordCompareAdapter implements IPasswordCompare {
  async compare(password: string, passwordHash: string) {
    return compare(password, passwordHash);
  }
}
