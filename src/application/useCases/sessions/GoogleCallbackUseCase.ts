import { Account } from '@application/entities/Account';
import { Profile } from '@application/entities/Profile';
import { NotFoundError } from '@application/errors/application/NotFoundError';
import { JWTService } from '@application/services/JWTService';
import { AccountRepository } from '@infra/database/prisma/repositories/AccountRepository';
import { Injectable } from '@kermel/decorators/Injectable';
import { env } from '@shared/env/env';

@Injectable()
export class GoogleCallbackUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly jwtService: JWTService,
  ) {}

  async execute(data: GoogleCallbackUseCase.Input): Promise<GoogleCallbackUseCase.Output> {
    const { code } = data;

    // 1. Trocar código por access token
    const tokenResponse = await this.exchangeCodeForToken(code);

    // 2. Buscar dados do usuário no Google
    const googleUser = await this.fetchGoogleUser(tokenResponse.access_token);

    // 3. Verificar se conta já existe com Google ID
    const account = await this.accountRepository.findByGoogleId(googleUser.id);

    if (account) {
      // Usuário já existe, fazer login
      const token = await this.jwtService.generateToken({
        accountId: account.id,
        email: account.email,
        role: account.role,
      });

      return {
        token,
        account: {
          id: account.id,
          email: account.email,
          role: account.role,
          isNew: false,
        },
      };
    }

    // 4. Verificar se já existe conta com o mesmo email
    const existingAccount = await this.accountRepository.findByEmail(googleUser.email);

    if (existingAccount) {
      // Vincular Google ID à conta existente
      await this.accountRepository.updateGoogleId(existingAccount.id, googleUser.id);

      const token = await this.jwtService.generateToken({
        accountId: existingAccount.id,
        email: existingAccount.email,
        role: existingAccount.role,
      });

      return {
        token,
        account: {
          id: existingAccount.id,
          email: existingAccount.email,
          role: existingAccount.role,
          isNew: false,
        },
      };
    }

    // 5. Criar nova conta
    const newAccount = Account.create({
      email: googleUser.email,
      password: null, // OAuth não precisa de senha
      role: Account.Role.COLLABORATOR,
      googleId: googleUser.id,
    });

    const newProfile = Profile.create({
      accountId: newAccount.id,
      name: googleUser.name,
      avatar: googleUser.picture,
    });

    await this.accountRepository.createWithProfile(newAccount, newProfile);

    const token = await this.jwtService.generateToken({
      accountId: newAccount.id,
      email: newAccount.email,
      role: newAccount.role,
    });

    return {
      token,
      account: {
        id: newAccount.id,
        email: newAccount.email,
        role: newAccount.role,
        isNew: true,
      },
    };
  }

  private async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: env.GOOGLE_CALLBACK_URL,
      }),
    });

    if (!response.ok) {
      throw new NotFoundError('Failed to exchange code for token');
    }

    return response.json();
  }

  private async fetchGoogleUser(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new NotFoundError('Failed to fetch user info from Google');
    }

    return response.json();
  }
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export namespace GoogleCallbackUseCase {
  export type Input = {
    code: string;
  };

  export type Output = {
    token: string;
    account: {
      id: string;
      email: string;
      role: string;
      isNew: boolean;
    };
  };
}
