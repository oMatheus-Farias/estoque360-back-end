import { IPasswordHasher } from '@domain/contracts/adapters/IPasswordHasher';
import { Injectable } from '@kermel/decorators/Injectable';
import { hash } from 'bcryptjs';

@Injectable()
export class PasswordHasherAdapter implements IPasswordHasher {
  async hash(password: string) {
    return hash(password, 12);
  }
}
