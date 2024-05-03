import { AdditionalReqSchema } from '@iam-hussain/qd-copilot';
import express, { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

// import jwt from '@/libs/jwt';
// import { JWT_OBJECT } from '@/types';
import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { storeService } from './service';
import { storeTransformer } from './transformer';

// const getStore = (slug: string, stores: { slug: string; id: string; shortId: string }[]) => {
//   return stores.find((e) => e.slug === slug);
// };

export const storeRouter: Router = (() => {
  const router = express.Router();

  router.get('/all', validateAccess('SIGN_IN'), async (req: Request, res: Response) => {
    const serviceResponse = await storeService.stores(req.context.user.id, req.context.user.type);
    handleServiceResponse(serviceResponse.map(storeTransformer.store), res);
  });

  router.get('/owner/:slug', validateAccess('SIGN_IN'), async (req: Request, res: Response) => {
    const slug = req.params.slug || '';

    if (slug && req.context.store.slug.toLowerCase() !== slug.toLowerCase()) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'INVALID_ACCESS' });
    }

    const serviceResponse = await storeService.store(slug);
    const transformedResponse = serviceResponse ? storeTransformer.store(serviceResponse) : {};
    handleServiceResponse(transformedResponse, res);
  });

  router.get('/', validateAccess('SIGN_STORE'), async (req: Request, res: Response) => {
    const serviceResponse = await storeService.store(req.context.store.slug);
    const transformedResponse = serviceResponse ? storeTransformer.store(serviceResponse) : {};
    handleServiceResponse(transformedResponse, res);
  });

  router.patch(
    '/additional',
    validateAccess('SIGN_STORE'),
    validateRequest(AdditionalReqSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const serviceResponse = await storeService.additional(req.context.store.slug, req.body);
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
        const serviceResponse = await storeService.featureFlag(req.context.store.slug, req.body);
        handleServiceResponse(serviceResponse, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
})();
