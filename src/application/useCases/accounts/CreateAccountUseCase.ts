import { PasswordHasherAdapter } from '@application/adapters/PasswordHasherAdapter';
import { Account } from '@application/entities/Account';
import { Profile } from '@application/entities/Profile';
import { CredentialsError } from '@application/errors/application/CredentialsError';
import { AccountRepository } from '@infra/database/prisma/repositories/AccountRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly passwordHasherAdapter: PasswordHasherAdapter,
  ) {}

  async execute(data: CreateAccountUseCase.Input): Promise<CreateAccountUseCase.Output> {
    const { name, email, password, role, phone, avatar } = data;

    const existingAccount = await this.accountRepository.findByEmail(email);

    if (existingAccount) {
      throw new CredentialsError('Email already exists');
    }

    const hashedPassword = await this.passwordHasherAdapter.hash(password);

    const account = Account.create({
      email,
      password: hashedPassword,
      role,
    });

    const profile = Profile.create({
      accountId: account.id,
      name,
      phone,
      avatar,
    });

    await this.accountRepository.createWithProfile(account, profile);

    return {
      account: {
        id: account.id,
      },
      profile: {
        id: profile.id,
      },
    };
  }
}

export namespace CreateAccountUseCase {
  export type Input = {
    email: string;
    password: string;
    name: string;
    role?: Account.Role;
    phone?: string | null;
    avatar?: string | null;
  };

  export type Output = {
    account: {
      id: string;
    };
    profile: {
      id: string;
    };
  };
}
