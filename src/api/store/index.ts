import { AdditionalReqSchema } from '@iam-hussain/qd-copilot';
import express, { NextFunction, Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { storeService } from './service';
import { storeTransformer } from './transformer';

export const storeRouter: Router = (() => {
  const router = express.Router();

  router.get('/', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const serviceResponse = await storeService.store(req.auth.storeSlug);
    const transformedResponse = serviceResponse ? storeTransformer.store(serviceResponse) : {};
    handleServiceResponse(transformedResponse, res);
  });

  router.patch(
    '/additional',
    validateAccess('SIGN_STORE'),
    validateRequest(AdditionalReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await storeService.additional(req.auth.storeSlug, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  router.patch(
    '/feature-flags',
    validateAccess('SIGN_STORE'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await storeService.featureFlag(req.auth.storeSlug, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
})();
