import { RequestContext } from '..';

declare global {
  declare namespace Express {
    interface Request {
      context: RequestContext;
    }
  }
}
