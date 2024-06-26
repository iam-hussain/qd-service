import { ParamIdReqSchema } from '@iam-hussain/qd-copilot';
import express, { Request, Response, Router } from 'express';

import { userService } from '@/api/user/service';
import { handleServiceResponse, validateRequest } from '@/utils/http-handlers';

export const userRouter: Router = (() => {
  const router = express.Router();

  router.get('/:id', validateRequest(ParamIdReqSchema), async (req: Request, res: Response) => {
    const id = req.params.id || '';
    const serviceResponse = await userService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
