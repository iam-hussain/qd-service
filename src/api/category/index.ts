import { CategoryCreateReqSchema, CategoryUpdateReqSchema, ParamIdReqSchema } from '@iam-hussain/qd-copilot';
import express, { NextFunction, Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { categoryService } from './service';

export const categoryRouter: Router = (() => {
  const router = express.Router();

  router.get('/categories', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const serviceResponse = await categoryService.categories(req.context.store.slug);
    handleServiceResponse(serviceResponse, res);
  });

  router.get(
    '/category/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(ParamIdReqSchema),
    async (req: Request, res: Response) => {
      const id = req.params.id || '';
      const serviceResponse = await categoryService.category(id, req.context.store.slug);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.post(
    '/category',
    validateAccess('SIGN_STORE'),
    validateRequest(CategoryCreateReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await categoryService.create(req.context.store.slug, req.body);
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
        const serviceResponse = await categoryService.update(req.context.store.slug, id, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/category/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(ParamIdReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id || '';
        const serviceResponse = await categoryService.delete(req.context.store.slug, id);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
})();
