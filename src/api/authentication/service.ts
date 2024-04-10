import { SignInSchemaType } from '@iam-hussain/qd-copilot';
import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/user/repository';
import hash from '@/libs/hash';
import jwt from '@/libs/jwt';
import { ResponseStatus, ServiceResponse } from '@/models/service-response';
import { logger } from '@/providers/server';
import { JWT_OBJECT } from '@/types';

import { storeRepository } from '../store/repository';
import { storeTransformer } from '../store/transformer';
import { userTransformer } from '../user/transformer';

export const authService = {
  signIn: async (input: SignInSchemaType) => {
    try {
      const user = await userRepository.findByEmail(input.email);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'USER_NOT_FOUND', null, StatusCodes.NOT_FOUND);
      }

      if (!user.password || !user.salt) {
        return new ServiceResponse(ResponseStatus.Failed, 'NO_PASSWORD_FOUND', null, StatusCodes.NOT_FOUND);
      }

      const isMatching = hash.verify(input.password, user.password, user.salt);

      if (!isMatching) {
        return new ServiceResponse(ResponseStatus.Failed, 'INVALID_PASSWORD', null, StatusCodes.NOT_FOUND);
      }

      const tokenData: JWT_OBJECT = {
        type: 'SELLER',
        username: user.username,
        userId: user.id,
        store: '',
        storeId: '',
      };

      const stores = await storeRepository.findManyByUser(user.id, user.type);

      if (stores.length === 1) {
        tokenData.store = stores[0].slug;
        tokenData.storeId = stores[0].id;
      }

      return {
        access_token: await jwt.encode(tokenData),
        includes_store: stores.length === 1,
        current_store: stores.length === 1 ? storeTransformer.store(stores[0]) : null,
        user: userTransformer.userPublic(user),
        stores: storeTransformer.stores(stores),
      };
    } catch (ex) {
      const errorMessage = `Error finding user with email ${input.email}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
