import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodSchema } from 'zod';

export const handleServiceResponse = (serviceResponse: any, response: Response, code: number = 200) => {
  return response.status(serviceResponse?.code || code).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    const statusCode = StatusCodes.BAD_REQUEST;
    res.status(statusCode).send(err);
  }
};
