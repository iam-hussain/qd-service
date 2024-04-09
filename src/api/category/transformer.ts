import { Category } from '@prisma/client';
import _ from 'lodash';

import dateTime from '@/libs/date-time';
import sorts from '@/libs/sorts';

const category = (
  category: Category & {
    _count?: {
      products?: number;
    };
  }
) => {
  const picked = _.pick(category, ['id', 'shortId', 'name', 'deck', 'position']);
  return {
    ...picked,
    productsConnected: category?._count?.products || 0,
    createdAt: dateTime.getDate(category.createdAt),
    createdDate: dateTime.getDateFormat(category.createdAt),
    createdDateTime: dateTime.getDateTimeFormat(category.createdAt),
    updatedAt: dateTime.getDate(category.updatedAt),
    updatedDate: dateTime.getDateFormat(category.updatedAt),
    updatedDateTime: dateTime.getDateTimeFormat(category.updatedAt),
  };
};

const categories = (
  categories: (Category & {
    _count?: {
      products?: number;
    };
  })[]
) => {
  const data = categories.map(category);
  return data.sort(sorts.zeroLastSortPosition);
};

export const categoryTransformer = {
  category,
  categories,
};
