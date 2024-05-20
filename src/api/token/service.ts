import { TokenUpdateSchemaType } from '@iam-hussain/qd-copilot';

import { tokenRepository } from '../token/repository';
import { tokenTransformer } from '../token/transformer';

export const tokenService = {
  todayTokens: async (slug: string, enableKitchenCategory: boolean = false) => {
    const repositoryResponse = await tokenRepository.findTodayByShortId(slug, enableKitchenCategory);
    return tokenTransformer.getTokensByTypes(repositoryResponse);
  },

  update: async (slug: string, id: string, body: Partial<TokenUpdateSchemaType>, userId: string) => {
    const { orderId, ...data } = body;
    console.log({
      slug,
      id,
      orderId,
      data,
      userId,
    });
    const repositoryResponse = await tokenRepository.update(slug, id, orderId || '', data, userId);
    return repositoryResponse;
  },
};
