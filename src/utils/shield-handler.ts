import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const validateAccess =
  (type: 'SIGN_OUT' | 'SIGN_IN' | 'SIGN_STORE' | 'ANYONE') => (req: any, res: Response, next: NextFunction) => {
    if (type === 'SIGN_OUT' && req.auth.hasToken) {
      const statusCode = StatusCodes.BAD_REQUEST;
      return res.status(statusCode).send({ message: 'TOKEN_EXIST' });
    }

    if (
      (type === 'SIGN_IN' || type === 'SIGN_STORE') &&
      (!req.auth.hasToken || !req.auth.isSeller || !req.auth.userId)
    ) {
      const statusCode = StatusCodes.BAD_REQUEST;
      return res.status(statusCode).send({ message: 'INVALID_ACCESS' });
    }

    if (type === 'SIGN_STORE' && (!req.auth.hasToken || !req.auth.hasStore || !req.auth.storeId)) {
      const statusCode = StatusCodes.BAD_REQUEST;
      return res.status(statusCode).send({ message: 'INVALID_ACCESS' });
    }

    next();
  };
