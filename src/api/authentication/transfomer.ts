import { JWT_OBJECT } from '@/types';

export const authTransformer = {
  getToken: (req: Request) => {
    const authorization = req.headers.get('authorization');
    if (!authorization) {
      return null;
    }

    const jwtToken = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!jwtToken) {
      return null;
    }

    return jwtToken;
  },
  extractToken: (decoded: JWT_OBJECT) => {
    const tokenType = decoded ? decoded.type : '';
    return {
      decoded,
      type: decoded ? decoded.type : '',
      isSeller: decoded && Boolean(decoded.userId) && tokenType === 'SELLER',
      hasStore: decoded && Boolean(decoded.storeId),
      storeId: decoded.storeId || null,
      userId: decoded.userId,
    };
  },
};
