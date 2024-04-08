import jwt from 'jsonwebtoken';

import { env } from '@/providers/env-config';
import { logger } from '@/providers/server';
import { JWT_OBJECT } from '@/types';

export default {
  decode: async (token: string) => {
    try {
      const decoded = jwt.verify(token, env.SECRET);
      return decoded as JWT_OBJECT;
    } catch (err) {
      return 'INVALID_TOKEN';
    }
  },

  encode: (payload: JWT_OBJECT) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          data: payload,
        },
        env.SECRET,
        { expiresIn: 60 * 60 * 24 },
        function (err, token) {
          if (err) {
            logger.error(err);
            reject(err);
          }
          resolve(token);
        }
      );
    });
  },
};
