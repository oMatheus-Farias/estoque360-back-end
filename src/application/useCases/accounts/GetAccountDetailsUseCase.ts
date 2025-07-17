import { ConflictError } from '@application/errors/application/ConflictError';
import { GetAccountDetailsQuery } from '@application/queries/accounts/GetAccountDetailsQuery';
import { AccountRepository } from '@infra/database/prisma/repositories/AccountRepository';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class GetAccountDetailsUseCase {
  constructor(
    private readonly getAccountDetailsQuery: GetAccountDetailsQuery,
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(data: GetAccountDetailsUseCase.Input): Promise<GetAccountDetailsUseCase.Output> {
    const { accountId } = data;

    const accountExists = await this.accountRepository.findById(accountId);

    if (!accountExists) {
      throw new ConflictError('Account not found.');
    }

    const accountDetails = await this.getAccountDetailsQuery.execute({
      accountId,
    });

    return {
      account: {
        id: accountDetails.account.id,
        email: accountDetails.account.email,
        googleId: accountDetails.account.googleId,
        role: accountDetails.account.role,
        status: accountDetails.account.status,
        createdAt: accountDetails.account.createdAt,
        updatedAt: accountDetails.account.updatedAt,
      },
      profile: {
        id: accountDetails.profile.id,
        name: accountDetails.profile.name,
        phone: accountDetails.profile.phone,
        avatar: accountDetails.profile.avatar,
        createdAt: accountDetails.profile.createdAt,
        updatedAt: accountDetails.profile.updatedAt,
      },
    };
  }
}

export namespace GetAccountDetailsUseCase {
  export type Input = {
    accountId: string;
  };

  export type Output = {
    account: {
      id: string;
      email: string;
      googleId: string | null;
      role: string;
      status: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    profile: {
      id: string;
      name: string;
      phone: string | null;
      avatar: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}
