import { IAccountRepository } from '@application/contracts/repositories/IAccountRepository';
import { Account } from '@application/entities/Account';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class GoogleOAuthUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(data: GoogleOAuthUseCase.Input): Promise<GoogleOAuthUseCase.Output> {
    const { googleId, email, name, avatar } = data;

    // Verifica se já existe uma conta com esse Google ID
    let account = await this.accountRepository.findByGoogleId(googleId);

    if (account) {
      return {
        account: {
          id: account.id,
          email: account.email,
          role: account.role,
          status: account.status,
          isNew: false,
        },
      };
    }

    // Verifica se já existe uma conta com esse email
    const existingAccount = await this.accountRepository.findByEmail(email);
    if (existingAccount) {
      throw new Error('An account with this email already exists. Please sign in with email/password.');
    }

    // Cria nova conta via Google
    account = await this.accountRepository.createGoogleAccount({
      email,
      googleId,
      name,
      avatar,
    });

    return {
      account: {
        id: account.id,
        email: account.email,
        role: account.role,
        status: account.status,
        isNew: true,
      },
    };
  }
}

export namespace GoogleOAuthUseCase {
  export type Input = {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
  };

  export type Output = {
    account: {
      id: string;
      email: string;
      role: Account.Role;
      status: boolean;
      isNew: boolean;
    };
  };
}
