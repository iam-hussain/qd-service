import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { logger } from '@/providers/server';

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};

const addErrorResponder: ErrorRequestHandler = (err, _req, res, next) => {
  if (!err) {
    next();
  }
  logger.error(err); // Log the error to the console

  // You can customize the error response based on the error type or status code
  res.status(500).send(err);
};

export default () => [unexpectedRequest, addErrorToRequestLog, addErrorResponder];
