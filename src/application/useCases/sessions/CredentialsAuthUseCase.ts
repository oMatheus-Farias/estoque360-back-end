import { PasswordCompareAdapter } from '@application/adapters/PasswordCompareAdapter';
import { RefreshToken } from '@application/entities/RefreshToken';
import { CredentialsError } from '@application/errors/application/CredentialsError';
import { AccountRepository } from '@infra/database/prisma/repositories/AccountRepository';
import { RefreshTokensRepository } from '@infra/database/prisma/repositories/RefreshTokenRepository';
import { Injectable } from '@kermel/decorators/Injectable';
import { EXP_TIME_IN_HOURS } from '@shared/constants/expTimeInHours';

@Injectable()
export class CredentialsAuthUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly refreshTokenRepository: RefreshTokensRepository,
    private readonly passwordCompareAdapter: PasswordCompareAdapter,
  ) {}

  async execute(data: CredentialsAuthUseCase.Input): Promise<CredentialsAuthUseCase.Output> {
    const { email, password } = data;

    const account = await this.accountRepository.findByEmail(email);

    if (!account) {
      throw new CredentialsError('Invalid credentials');
    }

    const isPasswordValid = await this.passwordCompareAdapter.compare(password, account.password);

    if (!isPasswordValid) {
      throw new CredentialsError('Invalid credentials');
    }

    const expiresAtRefreshToken = new Date();

    expiresAtRefreshToken.setHours(expiresAtRefreshToken.getHours() + EXP_TIME_IN_HOURS);

    const refreshTokenEntity = RefreshToken.create({
      accountId: account.id,
      expiresAt: expiresAtRefreshToken,
    });

    const { id: refreshTokenId } = await this.refreshTokenRepository.create(refreshTokenEntity);

    return {
      account: {
        id: account.id,
        email: account.email,
        role: account.role,
      },
      refreshToken: refreshTokenId,
    };
  }
}

export namespace CredentialsAuthUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    account: {
      id: string;
      email: string;
      role: string;
    };
    refreshToken: string;
  };
}
