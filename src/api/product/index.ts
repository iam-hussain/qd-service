import { ParamIdReqSchema, ProductCreateReqSchema, ProductUpdateReqSchema } from '@iam-hussain/qd-copilot';
import express, { NextFunction, Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { productService } from './service';

export const productRouter: Router = (() => {
  const router = express.Router();

  router.get('/products', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const serviceResponse = await productService.products(req.context.store.slug);
    handleServiceResponse(serviceResponse, res);
  });

  router.get(
    '/product/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(ParamIdReqSchema),
    async (req: Request, res: Response) => {
      const id = req.params.id || '';
      const serviceResponse = await productService.product(id, req.context.store.slug);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.post(
    '/product',
    validateAccess('SIGN_STORE'),
    validateRequest(ProductCreateReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await productService.create(req.context.store.slug, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.patch(
    '/product/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(ProductUpdateReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id || '';
        const serviceResponse = await productService.update(req.context.store.slug, id, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/product/:id',
    validateAccess('SIGN_STORE'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id || '';
        const serviceResponse = await productService.delete(req.context.store.slug, id);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
})();
