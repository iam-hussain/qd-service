import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/user/repository';
import { ResponseStatus, ServiceResponse } from '@/models/service-response';
import { logger } from '@/providers/server';

export const userService = {
  findById: async (id: string) => {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
