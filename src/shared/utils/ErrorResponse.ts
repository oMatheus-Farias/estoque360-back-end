import type { ErrorCode } from '@application/errors/ErrorCode';

interface IErrorResponseParams {
  code: ErrorCode;
  message: any;
  statusCode: number;
}

export function errorResponse({ code, message, statusCode }: IErrorResponseParams) {
  return {
    statusCode,
    body: {
      code,
      message,
    },
  };
}
