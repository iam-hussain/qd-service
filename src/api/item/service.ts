import { ItemUpdateSchemaType } from '@iam-hussain/qd-copilot';

import { itemRepository } from './repository';
import { itemTransformer } from './transformer';

export const itemService = {
  update: async (slug: string, id: string, data: ItemUpdateSchemaType, userId: string) => {
    if (!data?.orderId) {
      return {};
    }
    const input = itemTransformer.updateItem(data, userId);
    const repositoryResponse = await itemRepository.update(slug, id, data.orderId, input);
    return repositoryResponse;
  },
};
