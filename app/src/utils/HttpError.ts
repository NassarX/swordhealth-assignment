import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  statusCode: number;
  rawErrors: string[] = [];
  constructor(statusCode: number, message: string, rawErrors?: string[]) {
    super(message);

    this.statusCode = statusCode;
    if (rawErrors) this.rawErrors = rawErrors;
    Error.captureStackTrace(this, this.constructor);
  }
}


export class NotFoundError extends HttpError {
  constructor(path: string) {
    super(StatusCodes.NOT_FOUND, `The requested ${path} not found!`);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, errors: string[]) {
    super(StatusCodes.BAD_REQUEST, message, errors);
  }
}

export class ApplicationError extends HttpError {
  constructor(message: string, errors?: string[]) {
    super(StatusCodes.BAD_REQUEST, message, errors);
  }
}
