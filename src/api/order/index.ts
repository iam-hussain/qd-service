import express, { NextFunction, Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { GetOrderSchema, OrderUpsertSchema } from './model';
import { orderService } from './service';

export const orderRouter: Router = (() => {
  const router = express.Router();

  router.get(
    '/orders',
    validateAccess('SIGN_STORE'),
    validateRequest(GetOrderSchema),
    async (req: Request, res: Response) => {
      const serviceResponse = await orderService.orders(req.auth.storeSlug, req.params);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.get('/order/:id', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const id = req.params.id || '';
    const serviceResponse = await orderService.order(id, req.auth.storeSlug);
    handleServiceResponse(serviceResponse, res);
  });

  router.post(
    '/order',
    validateAccess('SIGN_STORE'),
    validateRequest(OrderUpsertSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await orderService.upsert(req.auth.storeSlug, req.body, req.auth.userId);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/order/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(GetOrderSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id || '';
        const serviceResponse = await orderService.delete(req.auth.storeSlug, id);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
})();
