import { ConflictError } from '@application/errors/application/ConflictError';
import { AccountRepository } from '@infra/database/prisma/repositories/AccountRepository';
import { RefreshTokenRepository } from '@infra/database/prisma/repositories/RefreshTokenRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class SignOutUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(data: SignOutUseCase.Input): Promise<SignOutUseCase.Output> {
    const { accountId } = data;

    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new ConflictError('Account not found');
    }

    const hasActiveSessions = await this.refreshTokenRepository.findAllByAccountId({ accountId });

    if (hasActiveSessions && hasActiveSessions.length === 0) {
      throw new ConflictError('No active sessions found for this user');
    }

    await this.refreshTokenRepository.deleteAll({ accountId });

    return;
  }
}

export namespace SignOutUseCase {
  export type Input = {
    accountId: string;
  };

  export type Output = void;
}
