import { Category, Item, Token } from '@prisma/client';
import _ from 'lodash';

import dateTime from '@/libs/date-time';

import { itemTransformer } from '../item/transformer';

const token = (
  token: Token & {
    items?: Item[];
  }
) => {
  const items = (token.items || []).filter((e) => e?.tokenId === token.id);
  const picked = _.pick(token, [
    'id',
    'shortId',
    'placedAt',
    'printedAt',
    'completedAt',
    'scheduledAt',
    'order',
    'orderId',
    'kitchenCategory',
  ]);

  return {
    ...picked,
    displayId: token.shortId ? token.shortId.split('-')[1] || token.shortId : '',
    items: itemTransformer.sortItems(items),
  };
};

const tokens = (
  tokens: (Token & {
    items?: Item[];
  })[],
  items: Item[] = []
) => {
  return tokens.map((token) => tokenTransformer.token({ ...token, items: [...(token?.items || []), ...items] }));
};

interface CreateTokenInput {
  token?: Partial<Token>;
  items: { id: string }[];
  kitchenCategoryId?: string; // Optional property with a default value of ''
}

const createToken = ({ token = {}, items, kitchenCategoryId = '' }: CreateTokenInput) => {
  return {
    ...token,
    items: {
      connect: items,
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

interface CreateTokenSplitsInput {
  token?: Partial<Token>;
  items: (Item & {
    product: {
      kitchenCategoryId?: string;
    };
  })[];
  enableKitchenCategory?: boolean;
}

const createTokensSplits = ({ token = {}, items, enableKitchenCategory = false }: CreateTokenSplitsInput) => {
  const validItems = items.filter((item) => !item?.tokenId);
  if (validItems.length === 0) {
    return [];
  }
  if (!enableKitchenCategory) {
    const itemsIds = validItems.map((e) => ({ id: e.id }));
    return [tokenTransformer.createToken({ token, items: itemsIds })];
  }
  const tokens = new Map<string, string[]>();

  validItems.forEach((e) => {
    const category = e?.product?.kitchenCategoryId || '';
    const token = tokens.get(category);
    const item = e.id;

    if (token) {
      tokens.set(category, [...token, item]);
    } else {
      tokens.set(category, [item]);
    }
  });

  return Array.from(tokens, ([name, value]) => {
    const itemsIds = value.map((e) => ({ id: e }));
    return tokenTransformer.createToken({ token, items: itemsIds, kitchenCategoryId: name });
  });
};

const sortTokens = (
  input: (Token & {
    items?: Item[];
    kitchenCategory?: Partial<Category> | null;
  })[]
) => {
  const sortedTokens = tokens(
    _.sortBy(
      input.filter((e) => e.items?.length),
      'shortId'
    )
  );
  return {
    scheduled: sortedTokens.filter((e) => e?.scheduledAt && dateTime.isAfterDate(e.placedAt)),
    placed: sortedTokens.filter((e) => e.placedAt && dateTime.isBeforeDate(e.placedAt)),
    completed: sortedTokens.filter((e) => Boolean(e.completedAt)),
  };
};

export const tokenTransformer = {
  tokens,
  token,
  createTokensSplits,
  createToken,
  sortTokens,
};
