import { Account } from '@application/entities/Account';
import { Profile } from '@application/entities/Profile';
import type { IAccountRepository } from '@domain/contracts/repositories/IAccountRepository';
import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';
import { randomUUID } from 'crypto';

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
      password: account?.password,
      role: account.role as Account.Role,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }

  async findByGoogleId(googleId: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: { googleId },
    });

    if (!account) return null;

    return new Account({
      id: account.id,
      email: account.email,
      password: account?.password,
      role: account.role as Account.Role,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }

  async createGoogleAccount(googleData: { email: string; googleId: string; name: string; avatar?: string }): Promise<Account> {
    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          id: randomUUID(),
          email: googleData.email,
          googleId: googleData.googleId,
          password: null, // Google accounts don't have password
          role: 'COLLABORATOR',
          status: true,
        },
      });

      await tx.profile.create({
        data: {
          id: randomUUID(),
          accountId: account.id,
          name: googleData.name,
          avatar: googleData.avatar || null,
          phone: null,
        },
      });

      return account;
    });

    return new Account({
      id: result.id,
      email: result.email,
      password: result?.password,
      role: result.role as Account.Role,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
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
      password: account?.password,
      role: account.role as Account.Role,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }

  async updateGoogleId(accountId: string, googleId: string): Promise<void> {
    await prisma.account.update({
      where: { id: accountId },
      data: { googleId },
    });
  }
}
