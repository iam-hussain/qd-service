import { SignInReqSchema } from '@iam-hussain/qd-copilot';
import express, { Request, Response, Router } from 'express';

import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';
import { validateAccess } from '@/utils/shield-handler';

import { authService } from './service';

export const authRouter: Router = (() => {
  const router = express.Router();

  router.get('/me', validateAccess('SIGN_IN'), async (req: Request, res: Response) => {
    const serviceResponse = await authService.me(req.context.user.id);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/sign-in', validateRequest(SignInReqSchema), async (req: Request, res: Response) => {
    const serviceResponse = await authService.signIn(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
