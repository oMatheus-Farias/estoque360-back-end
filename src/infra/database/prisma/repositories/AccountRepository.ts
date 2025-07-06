import { IAccountRepository } from '@application/contracts/repositories/IAccountRepository';
import { Account } from '@application/entities/Account';
import { Profile } from '@application/entities/Profile';
import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class AccountRepository implements IAccountRepository {
  async createWithProfile(account: Account, profile: Profile): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Cria a conta
      await tx.account.create({
        data: {
          id: account.id,
          email: account.email,
          password: account.password,
          role: account.role,
          status: account.status,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        },
      });

      // Cria o perfil
      await tx.profile.create({
        data: {
          id: profile.id,
          accountId: profile.accountId,
          name: profile.name,
          phone: profile.phone,
          avatar: profile.avatar,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        },
      });
    });
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: { email },
    });

    if (!account) return null;

    return new Account({
      id: account.id,
      email: account.email,
      password: account.password,
      role: account.role as Account.Role,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }

  async findById(id: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: { id },
    });

    if (!account) return null;

    return new Account({
      id: account.id,
      email: account.email,
      password: account.password,
      role: account.role as Account.Role,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }
}
