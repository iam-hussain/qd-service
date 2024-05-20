import { GetOrdersSchemaType, OrderUpsertSchemaType } from '@iam-hussain/qd-copilot';
import { ITEM_STATUS } from '@prisma/client';

import { itemRepository } from '../item/repository';
import { itemTransformer } from '../item/transformer';
import { tokenRepository } from '../token/repository';
import { tokenTransformer } from '../token/transformer';
import { orderRepository } from './repository';
import { orderTransformer } from './transformer';

export const orderService = {
  tokens: async (slug: string, enableKitchenCategory: boolean = false) => {
    const orders = await orderRepository.findManyBySlugForKitchen(slug, enableKitchenCategory);
    return orderTransformer.getKitchenOrders(orders);
  },
  kitchenOrders: async (slug: string, enableKitchenCategory: boolean = false) => {
    const orders = await orderRepository.findManyBySlugForKitchen(slug, enableKitchenCategory);
    return orderTransformer.getKitchenOrders(orders);
  },
  order: async (id: string, slug: string) => {
    const repositoryResponse = await orderRepository.findByShortId(id, slug);
    return orderTransformer.getOrder(repositoryResponse);
  },
  orders: async (slug: string, data: GetOrdersSchemaType) => {
    const { take, date, cursor, skip, type, types, status, statuses } = data;
    const props: any = {
      where: {
        store: {
          slug,
        },
      },
      take,
      orderBy: {
        shortId: 'desc',
      },
      include: {
        items: true,
      },
    };
    if (date) {
      props.where.shortId = {
        contain: date,
      };
      // props.where.createdAt = {
      //   gte: dateTime.getTodayStart(),
      //   lte: dateTime.getTodayEnd(),
      // };
    }
    if (cursor) {
      props.cursor = {
        id: cursor,
      };
      props.skip = 1;
    } else {
      props.skip = skip;
    }

    if (type) {
      props.where.type = type;
    }

    if (status) {
      props.where.status = status;
    }

    if (types && types.length) {
      props.where.type = { in: types };
    }

    if (statuses && statuses.length) {
      props.where.status = { in: statuses };
    }
    const repositoryResponse = (await orderRepository.findManyByStoreSlug(props)) as any[];
    return repositoryResponse.map(orderTransformer.getOrder);
  },
  upsert: async (slug: string, data: OrderUpsertSchemaType, userId: string) => {
    const { shortId, items } = data;

    const enableKitchenCategory = Boolean(data.enableKitchenCategory);

    const input = orderTransformer.getOrderUpsert(data);
    let repositoryResponse: any = null;
    const itemsInput = items.map((e: any) => itemTransformer.getConnectItemData(e, userId));

    if (itemsInput.length) {
      input.items = {
        ...(input?.items || {}),
        create: itemsInput,
      };
    }

    if (shortId) {
      const fetchedOrder = await orderRepository.findByShortId(shortId, slug);

      if (!fetchedOrder || !fetchedOrder.id) {
        throw new Error('INVALID_INPUT');
      }
      const existingDraftItems = fetchedOrder.items.filter((e) => e?.status === 'DRAFT');
      const draftedIds = existingDraftItems.map((e) => e.id);

      if (fetchedOrder.items.length) {
        input.items = {
          ...(input?.items || {}),
          disconnect: draftedIds.map((e) => ({ id: e })),
        };
      }

      repositoryResponse = await orderRepository.update(slug, fetchedOrder.shortId, input, userId);
      if (draftedIds.length) {
        await itemRepository.deleteManyByIds(draftedIds);
      }
    } else {
      repositoryResponse = await orderRepository.create(slug, input, userId);
    }

    if (!repositoryResponse || !repositoryResponse.id) {
      throw new Error('INVALID_INPUT');
    }

    const tokenData = tokenTransformer.getCreateTokensByItems(
      (repositoryResponse?.items || []).filter((e: any) => !e.tokenId && e.status === ITEM_STATUS.PLACED),
      slug,
      repositoryResponse.id,
      userId,
      (repositoryResponse.tokens || []).length,
      enableKitchenCategory
    );

    const token = await Promise.all(tokenData.map(tokenRepository.create));
    return orderTransformer.getOrder({
      ...repositoryResponse,
      tokens: [...(repositoryResponse.tokens || []), token],
    });
  },
  delete: async (slug: string, id: string) => {
    const repositoryResponse = await orderRepository.deleteById(slug, id);
    return repositoryResponse;
  },
};
