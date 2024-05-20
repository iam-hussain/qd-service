import { Category, Item, Token } from '@prisma/client';
import _ from 'lodash';

import dateTime from '@/libs/date-time';
import idGenerator from '@/libs/id-generator';

import { itemTransformer } from '../item/transformer';

const getConnectTokenData = (
  items: Partial<Item>[],
  slug: string,
  orderId: string,
  userId: string,
  kitchenCategoryId: string = '',
  tokenIdNumber: number = 0
) => {
  return {
    id: idGenerator.generateShortID(),
    shortId: tokenIdNumber.toString().padStart(3, '0'),
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
    ...(kitchenCategoryId
      ? {
          kitchenCategory: {
            connect: {
              id: kitchenCategoryId,
            },
          },
        }
      : {}),
  };
};

const getCreateManyTokenData = (
  items: Partial<Item>[],
  storeId: string,
  orderId: string,
  userId: string,
  kitchenCategoryId: string = ''
) => {
  return {
    id: idGenerator.generateShortID(),
    shortId: idGenerator.generateShortID(),
    storeId,
    createdId: userId,
    items: {
      connect: items.map((e) => ({ id: e.id })),
    },
    orderId,
    ...(kitchenCategoryId
      ? {
          kitchenCategoryId,
        }
      : {}),
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
    'order',
    'createdAt',
    'updatedAt',
    'orderShortId',
    'kitchenCategory',
  ]);

  return {
    ...picked,
    items: itemTransformer.getItemTypeDivided((token.items || []).filter((e) => e.tokenId === picked.id)),
    ...addon,
  };
};

const getCreateTokensByItems = (
  items: Item[],
  slug: string,
  orderId: string,
  userId: string,
  lastTokenId: number = 0,
  enableKitchenCategory: boolean = false
) => {
  if (!enableKitchenCategory) {
    return [
      tokenTransformer.getConnectTokenData(
        items.map((e) => ({ id: e.id })),
        slug,
        orderId,
        userId,
        '',
        lastTokenId + 1
      ),
    ];
  }
  const tokens = new Map<string, string[]>();

  items.forEach((e) => {
    const category = e.kitchenCategoryId || '';
    const token = tokens.get(category);
    const item = e.id;

    if (token) {
      tokens.set(category, [...token, item]);
    } else {
      tokens.set(category, [item]);
    }
  });

  return Array.from(tokens, ([name, value], i) =>
    tokenTransformer.getConnectTokenData(
      value.map((e) => ({ id: e })),
      slug,
      orderId,
      userId,
      name,
      lastTokenId + i + 1
    )
  );
};

const getTokens = (
  tokens: (Token & {
    items?: Item[];
  })[]
) => {
  return tokens.map(tokenTransformer.getToken);
};

const getTokensByTypes = (
  tokens: (Token & {
    items?: Item[];
    kitchenCategory?: Category | null;
  })[]
) => {
  const transformed = tokens.filter((e) => e?.items && e.items?.length).map(tokenTransformer.getToken);

  return {
    all: transformed,
    scheduled: transformed.filter((e) => dateTime.isAfterDate(e.placeAt)),
    placed: transformed.filter((e) => !e.completedAt && dateTime.isBeforeDate(e.placedAt)),
    completed: transformed.filter((e) => Boolean(e.completedAt)),
  };
};

export const tokenTransformer = {
  getTokens,
  getToken,
  getCreateTokensByItems,
  getConnectTokenData,
  getCreateManyTokenData,
  getTokensByTypes,
};
