import { ErrorBase } from '../errors';
import * as express from 'express';

export const errorHandler = (
  err: ErrorBase,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error('API error:', err);

  // if instance of our errorbase, print out the friendly messages, otherwise output a default
  const output = {
    httpStatusCode: 500,
    friendly: 'Api error occurred',
    message: 'Api error occurred'
  };

  if (output.message) {
    output.message = err.message;
  }
  if (output.friendly) {
    output.friendly = err.friendly;
  }
  if (output.httpStatusCode) {
    output.httpStatusCode = err.httpStatusCode;
  }

  res.status(output.httpStatusCode).send(output);
};
