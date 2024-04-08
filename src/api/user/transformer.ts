import { User } from '@prisma/client';
import _ from 'lodash';

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
    createdDate: dateTime.getDateFormat(account.createdAt),
    createdDateTime: dateTime.getDateTimeFormat(account.createdAt),
    updatedDate: dateTime.getDateFormat(account.updatedAt),
    updatedDateTime: dateTime.getDateTimeFormat(account.updatedAt),
  };
};

export const userTransformer = {
  userPublic,
};
