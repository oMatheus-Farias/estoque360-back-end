import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './ApplicationError';

export class NotFoundError extends ApplicationError {
  public override statusCode = 404;

  public override code: ErrorCode;

  constructor(message?: any, code?: ErrorCode) {
    super();

    this.name = 'NotFound';
    this.message = message ?? 'Resource not found';
    this.code = code ?? ErrorCode.NOT_FOUND;
  }
}
