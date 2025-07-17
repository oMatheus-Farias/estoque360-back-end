import { RefreshToken } from '@application/entities/RefreshToken';
import type { IRefreshTokenRepository } from '@domain/contracts/repositories/IRefreshTokenRepository';
import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  async findById(data: Pick<RefreshToken, 'id'>): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { id: data.id },
    });

    if (!refreshToken) return null;

    return new RefreshToken({
      id: refreshToken.id,
      accountId: refreshToken.accountId,
      expiresAt: refreshToken.expiresAt,
      createdAt: refreshToken.createdAt,
    });
  }

  async findAllByAccountId(data: Pick<RefreshToken, 'accountId'>): Promise<RefreshToken[] | []> {
    const refreshTokens = await prisma.refreshToken.findMany({
      where: { accountId: data.accountId },
    });

    if (refreshTokens.length === 0) return [];

    return refreshTokens.map(
      (token) =>
        new RefreshToken({
          id: token.id,
          accountId: token.accountId,
          expiresAt: token.expiresAt,
          createdAt: token.createdAt,
        }),
    );
  }

  async create(data: RefreshToken): Promise<Pick<RefreshToken, 'id'>> {
    const refreshToken = await prisma.refreshToken.create({
      data: {
        id: data.id,
        accountId: data.accountId,
        expiresAt: data.expiresAt,
        createdAt: data.createdAt,
      },
    });

    return { id: refreshToken.id };
  }

  async deleteAll(data: Pick<RefreshToken, 'accountId'>): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { accountId: data.accountId },
    });
  }
}
