import { RequestAuth } from '..';

declare global {
  declare namespace Express {
    interface Request {
      auth: RequestAuth;
    }
  }
}
