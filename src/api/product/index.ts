import express, { NextFunction, Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { ProductCreateSchema, ProductUpdateSchema } from './model';
import { productService } from './service';

export const productRouter: Router = (() => {
  const router = express.Router();

  router.get('/products', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const serviceResponse = await productService.products(req.auth.storeSlug);
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/product/:id', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const id = req.params.id || '';
    const serviceResponse = await productService.product(id, req.auth.storeSlug);
    handleServiceResponse(serviceResponse, res);
  });

  router.post(
    '/product',
    validateAccess('SIGN_STORE'),
    validateRequest(ProductCreateSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await productService.create(req.auth.storeSlug, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.patch(
    '/product/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(ProductUpdateSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id || '';
        const serviceResponse = await productService.update(req.auth.storeSlug, id, req.body);
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
        const serviceResponse = await productService.delete(req.auth.storeSlug, id);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
})();
