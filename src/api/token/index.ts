import { TokenUpdateReqSchema } from '@iam-hussain/qd-copilot';
import express, { NextFunction, Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { tokenService } from './service';

export const tokenRouter: Router = (() => {
  const router = express.Router();

  router.get('/tokens', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const enableKitchenCategory = Boolean(req.query?.category) && req.query?.category === 'true';
    const serviceResponse = await tokenService.todayTokens(req.context.store.slug, enableKitchenCategory);
    handleServiceResponse(serviceResponse, res);
  });

  router.patch(
    '/token/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(TokenUpdateReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id || '';
        const serviceResponse = await tokenService.update(req.context.store.slug, id, req.body, req.context.user.id);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
})();
