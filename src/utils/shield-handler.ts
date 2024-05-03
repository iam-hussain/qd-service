import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const validateAccess =
  (type: 'SIGN_OUT' | 'SIGN_IN' | 'SIGN_STORE' | 'ANYONE') => (req: any, res: Response, next: NextFunction) => {
    const isStoreExist = Boolean(req.context.store.slug);

    if (type === 'SIGN_OUT' && req.context.tokenExist) {
      const statusCode = StatusCodes.BAD_REQUEST;
      return res.status(statusCode).send({ message: 'TOKEN_EXIST' });
    }

    if (
      type === 'SIGN_IN' &&
      (!req.context.tokenExist || req.context.user.type !== 'SELLER' || !req.context.authenticated)
    ) {
      const statusCode = StatusCodes.BAD_REQUEST;
      return res.status(statusCode).send({ message: 'INVALID_ACCESS' });
    }

    if (
      type === 'SIGN_STORE' &&
      (!req.context.tokenExist || req.context.user.type !== 'SELLER' || !req.context.authenticated || !isStoreExist)
    ) {
      const statusCode = StatusCodes.BAD_REQUEST;
      return res.status(statusCode).send({ message: 'INVALID_ACCESS' });
    }

    next();
  };
