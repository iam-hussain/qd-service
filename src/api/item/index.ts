import { ItemUpdateReqSchema } from '@iam-hussain/qd-copilot';
import express, { Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { itemService } from './service';

export const itemRouter: Router = (() => {
  const router = express.Router();

  router.post(
    '/order/item/:id',
    validateAccess('SIGN_STORE'),
    validateRequest(ItemUpdateReqSchema),
    async (req: Request, res: Response) => {
      const serviceResponse = await itemService.update(
        req.context.store.slug,
        req.params.id,
        req.body,
        req.context.user.id
      );
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();
