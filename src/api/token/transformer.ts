import { Item, Token } from '@prisma/client';
import _ from 'lodash';

import idGenerator from '@/libs/id-generator';

import { itemTransformer } from '../item/transformer';

const getConnectTokenData = (items: Item[], slug: string, orderId: string, userId: string) => {
  return {
    id: idGenerator.generateShortID(),
    shortId: idGenerator.generateShortID(),
    store: {
      connect: {
        slug: slug,
      },
    },
    createdBy: {
      connect: {
        id: userId,
      },
    },
    items: {
      connect: items.map((e) => ({ id: e.id })),
    },
    order: {
      connect: {
        id: orderId,
      },
    },
  };
};

const getToken = (
  token: Token & {
    items?: Item[];
  },
  addon: any = {}
) => {
  const picked = _.pick(token, [
    'id',
    'shortId',
    'printed',
    'printedAt',
    'completed',
    'completedAt',
    'orderId',
    'createdAt',
    'updatedAt',
    'orderShortId',
  ]);

  return {
    ...picked,
    items: itemTransformer.getItemTypeDivided((token.items || []).filter((e) => e.tokenId === picked.id)),
    ...addon,
  };
};

export const tokenTransformer = {
  getToken,
  getConnectTokenData,
};
