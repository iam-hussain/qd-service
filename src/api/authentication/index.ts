import express, { Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';

import { SignInReqSchema } from './model';
import { authService } from './service';

export const authRouter: Router = (() => {
  const router = express.Router();

  router.post('/sign-in', validateRequest(SignInReqSchema), async (req: Request, res: Response) => {
    console.log('Called');
    const serviceResponse = await authService.signIn(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
