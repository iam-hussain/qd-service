import { JWT_DECODE, RequestAuth } from '@/types';

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
  extractToken: (decoded: JWT_DECODE): RequestAuth => {
    const data = decoded.data || {};
    const type = data ? data.type : '';
    return {
      // ...data,
      // type,
      hasToken: true,
      isSeller: data && Boolean(data.userId) && type === 'SELLER',
      hasStore: data && Boolean(data.storeId),
      storeId: data.storeId || '',
      userId: data.userId,
      storeSlug: data.store || '',
    };
  },
};
