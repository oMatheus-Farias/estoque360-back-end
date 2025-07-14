import { RefreshToken } from '@application/entities/RefreshToken';
import { CredentialsError } from '@application/errors/application/CredentialsError';
import { NotFoundError } from '@application/errors/application/NotFoundError';
import { AccountRepository } from '@infra/database/prisma/repositories/AccountRepository';
import { RefreshTokensRepository } from '@infra/database/prisma/repositories/RefreshTokenRepository';
import { Injectable } from '@kermel/decorators/Injectable';
import { EXP_TIME_IN_HOURS } from '@shared/constants/expTimeInHours';

@Injectable()
export class CreateRefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokensRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(data: CreateRefreshTokenUseCase.Input): Promise<CreateRefreshTokenUseCase.Output> {
    const { id } = data;

    const refreshToken = await this.refreshTokenRepository.findById({ id });

    if (!refreshToken) {
      throw new NotFoundError('Refresh token not found');
    }

    if (Date.now() > refreshToken.expiresAt.getTime()) {
      await this.refreshTokenRepository.deleteAll({ accountId: refreshToken.accountId });
      throw new CredentialsError('Refresh token expired.');
    }
    await this.refreshTokenRepository.deleteAll({ accountId: refreshToken.accountId });

    const account = await this.accountRepository.findById(refreshToken.accountId);

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    const expiresAtRefreshToken = new Date();

    expiresAtRefreshToken.setHours(expiresAtRefreshToken.getHours() + EXP_TIME_IN_HOURS);

    const refreshTokenEntity = RefreshToken.create({
      accountId: account.id,
      expiresAt: expiresAtRefreshToken,
    });

    const { id: refreshTokenId } = await this.refreshTokenRepository.create(refreshTokenEntity);

    return {
      refreshToken: refreshTokenId,
      account,
    };
  }
}

export namespace CreateRefreshTokenUseCase {
  export type Input = {
    id: string;
  };

  export type Output = {
    refreshToken: string;
    account: {
      id: string;
      email: string;
      role: string;
      createdAt: Date;
    };
  };
}
