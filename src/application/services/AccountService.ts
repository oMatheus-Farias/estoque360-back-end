import { prisma } from '@infra/clients/prismaClient';
import { AccountRepository } from '@infra/database/prisma/repositories/AccountRepository';
import { ProfileRepository } from '@infra/database/prisma/repositories/ProfileRepository';
import { Injectable } from '@kermel/decorators/Injectable';
import { CreateAccountWithProfileInput } from '@shared/types/account/AccountService';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}
  async createAccountWithProfile(data: CreateAccountWithProfileInput): Promise<{
    account: { id: string };
    profile: { id: string };
  }> {
    // Verifica se o email já existe
    const existingAccount = await this.accountRepository.findByEmail(data.email);
    if (existingAccount) {
      throw new Error('Email already exists');
    }

    // Executa a criação em uma transação para garantir atomicidade
    return await prisma.$transaction(async () => {
      // Cria a conta
      const account = await this.accountRepository.create({
        email: data.email,
        password: data.password,
        role: data.role,
      });

      // Cria o perfil vinculado à conta
      const profile = await this.profileRepository.create({
        accountId: account.id,
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
      });

      return {
        account: {
          id: account.id,
        },
        profile: {
          id: profile.id,
        },
      };
    });
  }
}
