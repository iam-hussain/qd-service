import { SignInSchemaType, validationErrorResponse } from '@iam-hussain/qd-copilot';
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
  me: async (userID: string) => {
    try {
      const user = await userRepository.findById(userID);
      if (!user) {
        throw new Error('INVALID');
      }
      return userTransformer.userPublic(user);
    } catch (ex) {
      const errorMessage = `Error finding user data for ${userID}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  signIn: async (input: SignInSchemaType) => {
    try {
      const user = await userRepository.findByEmail(input.email.toLowerCase());
      if (!user) {
        return validationErrorResponse('email', 'user_not_exist');
      }

      if (!user.password || !user.salt) {
        return validationErrorResponse('password', 'password_not_added');
      }
      const isMatching = hash.verify(input.password, user.password, user.salt);

      if (!isMatching) {
        return validationErrorResponse('password', 'password_incorrect');
      }

      const tokenData: JWT_OBJECT = {
        user: {
          id: user.id,
          shortId: user.shortId,
          type: user.type,
        },
        stores: [],
        store: {
          shortId: '',
          slug: '',
          id: '',
        },
      };

      const stores = await storeRepository.findManyByUser(user.id, user.type);

      tokenData.stores = stores.map((e) => ({
        shortId: e.shortId,
        slug: e.slug,
        id: e.id,
      }));

      if (tokenData.stores.length === 1) {
        tokenData.store = tokenData.stores[0];
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
