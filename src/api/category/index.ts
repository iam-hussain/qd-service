import express, { NextFunction, Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { AdditionalSchema } from './model';
import { storeService } from './service';

export const categoryRouter: Router = (() => {
  const router = express.Router();

  router.get('/', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const serviceResponse = await storeService.store(req.auth.storeSlug);
    handleServiceResponse(serviceResponse, res);
  });

  router.patch(
    '/additional',
    validateAccess('SIGN_STORE'),
    validateRequest(AdditionalSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await storeService.additional(req.auth.storeSlug, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
})();
