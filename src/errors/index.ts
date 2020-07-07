import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';

export abstract class ErrorBase extends Error {
  public httpStatusCode: number;
  public name: string; // name of the error itself
  public message: string; // message regarding the error
  public friendly: string; // friendly message describing the type of error occured

  constructor(message: string, friendly?: string) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.friendly = friendly ? friendly : message;
    this.httpStatusCode = this._getHttpCode();
  }

  public _getHttpCode() {
    switch (this.name) {
      case ValidationError.name:
        return BAD_REQUEST;
      case HttpNotFoundError.name:
        return NOT_FOUND;
      case APIError.name:
      case QueryError.name:
      case NotFoundError.name:
      default:
        return INTERNAL_SERVER_ERROR;
    }
  }
}

export class GenericError extends ErrorBase {}
export class QueryError extends ErrorBase {}
export class NotFoundError extends ErrorBase {}
export class APIError extends ErrorBase {}
export class ValidationError extends ErrorBase {}
export class HttpNotFoundError extends ErrorBase {}
