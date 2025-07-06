import { Account } from '@application/entities/Account';
import { Profile } from '@application/entities/Profile';
import { EmailAlreadyInUse } from '@application/errors/application/EmailAlreadyInUse';
import { AccountRepository } from '@infra/database/prisma/repositories/AccountRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class CreateAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(data: CreateAccountUseCase.Input): Promise<CreateAccountUseCase.Output> {
    const { name, email, password, role, phone, avatar } = data;

    // Verifica se o email já existe
    const existingAccount = await this.accountRepository.findByEmail(email);
    if (existingAccount) {
      throw new EmailAlreadyInUse('Email already exists');
    }

    // Hash da senha (implementar bcrypt depois)
    const hashedPassword = await this.hashPassword(password);

    // Cria as entidades
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

    // ✅ Agora o repositório cuida da transação
    await this.accountRepository.createWithProfile(account, profile);

    // Retorna dados seguros (sem senha)
    return {
      account: {
        id: account.id,
      },
      profile: {
        id: profile.id,
      },
    };
  }

  private async hashPassword(password: string): Promise<string> {
    // Implementar hash da senha (bcrypt, argon2, etc.)
    // Por enquanto retorna a senha como está
    return password;
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
