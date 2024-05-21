import { TokenUpdateSchemaType } from '@iam-hussain/qd-copilot';
import { Item, Token } from '@prisma/client';

import { tokenRepository } from '../token/repository';
import { tokenTransformer } from '../token/transformer';

export const tokenService = {
  todayTokens: async (slug: string, enableKitchenCategory: boolean = false) => {
    const repositoryResponse = await tokenRepository.findTodayByShortId(slug, enableKitchenCategory);
    return tokenTransformer.sortTokens(repositoryResponse);
  },

  update: async (slug: string, id: string, body: Partial<TokenUpdateSchemaType>, userId: string) => {
    const { orderId, ...data } = body;
    const repositoryResponse = await tokenRepository.update(slug, id, orderId || '', data, userId);
    return repositoryResponse;
  },

  createManyOneByOne: async (
    slug: string,
    orderId: string,
    items: (Item & {
      product: {
        kitchenCategoryId?: string;
      };
    })[],
    userId: string,
    enableKitchenCategory: boolean = false,
    token: Partial<Token> = {}
  ) => {
    const tokenCreateData = tokenTransformer.createTokensSplits({
      token,
      items,
      enableKitchenCategory,
    });

    const created = [];

    for (const data of tokenCreateData) {
      const createdUser = await tokenRepository.create(slug, orderId, data, userId);
      created.push(createdUser);
    }
    return created;
  },
};
