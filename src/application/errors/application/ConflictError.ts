import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './ApplicationError';

export class ConflictError extends ApplicationError {
  public override statusCode = 409;

  public override code: ErrorCode;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.name = 'Conflict';
    this.message = message ?? 'Resource conflict';
    this.code = code ?? ErrorCode.CONFLICT;
  }
}
