import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './ApplicationError';

export class CredentialsError extends ApplicationError {
  public override statusCode = 401;

  public override code: ErrorCode;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.name = 'CredentialsError';
    this.message = message ?? 'Credentials error occurred';
    this.code = code ?? ErrorCode.CREDENTIALS;
  }
}
