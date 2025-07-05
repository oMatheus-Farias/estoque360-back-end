import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';
import { Account } from '@shared/entities/Account';
import { CreateAccountInput } from '@shared/types/account/AccountTypes';
import { randomUUID } from 'crypto';

@Injectable()
export class AccountRepository {
  async create(data: CreateAccountInput): Promise<Pick<Account, 'id'>> {
    const account = await prisma.account.create({
      data: {
        id: randomUUID(),
        email: data.email,
        password: data.password,
        role: data.role || 'COLLABORATOR',
      },
    });

    return {
      id: account.id,
    };
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: { email },
    });

    if (!account) return null;

    return {
      id: account.id,
      email: account.email,
      password: account.password,
      role: account.role,
      status: account.status,
    };
  }

  async findById(id: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: { id },
    });

    if (!account) return null;

    return {
      id: account.id,
      email: account.email,
      password: account.password,
      role: account.role,
      status: account.status,
    };
  }
}
