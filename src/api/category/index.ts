import express, { NextFunction, Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { CategoryCreateReqSchema, CategoryUpdateReqSchema, GetCategoryReqSchema } from './model';
import { categoryService } from './service';

export const categoryRouter: Router = (() => {
  const router = express.Router();

  router.get('/categories', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const serviceResponse = await categoryService.categories(req.auth.storeSlug);
    handleServiceResponse(serviceResponse, res);
  });

  router.get(
    '/category/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(GetCategoryReqSchema),
    async (req: Request, res: Response) => {
      const id = req.params.id || '';
      const serviceResponse = await categoryService.category(id, req.auth.storeSlug);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.post(
    '/category',
    validateAccess('SIGN_STORE'),
    validateRequest(CategoryCreateReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await categoryService.create(req.auth.storeSlug, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.patch(
    '/category/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(CategoryUpdateReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id || '';
        const serviceResponse = await categoryService.update(req.auth.storeSlug, id, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/category/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(GetCategoryReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id || '';
        const serviceResponse = await categoryService.delete(req.auth.storeSlug, id);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
})();
