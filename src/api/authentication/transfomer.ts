import { JWT_DECODE, RequestContext } from '@/types';

export const authTransformer = {
  getToken: (req: any) => {
    const authorization = req.headers['authorization'] || '';
    if (!authorization) {
      return null;
    }
    const jwtToken = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!jwtToken) {
      return null;
    }

    return jwtToken;
  },
  extractToken: (decoded: JWT_DECODE): RequestContext => {
    const data = decoded.data || {};
    return {
      authenticated: Boolean(data?.user?.id),
      tokenExist: true,
      ...data,
    };
  },
};
