import { AccountService } from '@application/services/AccountService';
import { Injectable } from '@kermel/decorators/Injectable';
import { CreateAccountWithProfileInput, CreateAccountWithProfileOutput } from '@shared/types/account/AccountService';

@Injectable()
export class CreateAccountUseCase {
  constructor(private readonly accountService: AccountService) {}

  async execute(data: CreateAccountUseCase.Input): Promise<CreateAccountUseCase.Output> {
    const { name, email, password, role, phone, avatar } = data;

    const hashedPassword = await this.hashPassword(password);

    return await this.accountService.createAccountWithProfile({
      email,
      password: hashedPassword,
      name,
      phone,
      avatar,
      role,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    // Implementar hash da senha (bcrypt, argon2, etc.)
    // Por enquanto retorna a senha como está
    return password;
  }
}

export namespace CreateAccountUseCase {
  export type Input = CreateAccountWithProfileInput;

  export type Output = CreateAccountWithProfileOutput;
}
