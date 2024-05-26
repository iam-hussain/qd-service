import { GetOrdersReqSchema, OrderUpsertReqSchema, ParamIdReqSchema } from '@iam-hussain/qd-copilot';
import express, { NextFunction, Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { orderService } from './service';

export const orderRouter: Router = (() => {
  const router = express.Router();

  router.get(
    '/orders',
    validateAccess('SIGN_STORE'),
    validateRequest(GetOrdersReqSchema),
    async (req: Request, res: Response) => {
      const serviceResponse = await orderService.orders(req.context.store.slug, req.query as any);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.get('/orders/open', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const serviceResponse = await orderService.openOrders(req.context.store.slug);
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/orders/recent', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const serviceResponse = await orderService.recentOrders(req.context.store.slug);
    handleServiceResponse(serviceResponse, res);
  });

  router.get(
    '/order/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(ParamIdReqSchema),
    async (req: Request, res: Response) => {
      const id = req.params.id || '';
      const serviceResponse = await orderService.order(id, req.context.store.slug);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.post(
    '/order',
    validateAccess('SIGN_STORE'),
    validateRequest(OrderUpsertReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await orderService.upsert(req.context.store.slug, req.body, req.context.user.id);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete('/order/:id', validateAccess('SIGN_STORE'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id || '';
      const serviceResponse = await orderService.delete(req.context.store.slug, id);
      handleServiceResponse(serviceResponse, res);
    } catch (err) {
      next(err);
    }
  });

  return router;
})();
