import { User } from '@prisma/client';
import { userRepository } from '@/api/user/repository';
import _ from 'lodash';
import {} from './repository';

import dateTime from '@/libs/date-time';

const userPublic = (account: User) => {
  const picked = _.pick(account, [
    'id',
    'type',
    'shortId',
    'firstName',
    'lastName',
    'email',
    'username',
    'phone',
    'emailVerified',
    'phoneVerified',
  ]);

  return {
    ...picked,
    fullName: [picked.firstName, picked.lastName].filter(Boolean).join(' '),
    createdDate: dateTime.getDateFormat(account.createdAt),
    createdDateTime: dateTime.getDateTimeFormat(account.createdAt),
    updatedDate: dateTime.getDateFormat(account.updatedAt),
    updatedDateTime: dateTime.getDateTimeFormat(account.updatedAt),
  };
};

const userPublicWithStore = (account: Awaited<ReturnType<typeof userRepository.findByIdWithStore>>) => {
  if (!account) {
    return {};
  }

  const user = userPublic(account);
  return {
    ...user,
    stores: account.connections.map((e) => ({ ...e.store })),
  };
};

export const userTransformer = {
  userPublic,
  userPublicWithStore,
};
