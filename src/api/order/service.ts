import { GetOrdersSchemaType, OrderUpsertSchemaType } from '@iam-hussain/qd-copilot';

import dateTime from '@/libs/date-time';

import { itemRepository } from '../item/repository';
import { itemTransformer } from '../item/transformer';
import { tokenService } from '../token/service';
import { orderRepository } from './repository';
import { orderTransformer } from './transformer';

export const orderService = {
  order: async (id: string, slug: string) => {
    const repositoryResponse = await orderRepository.findByShortId(id, slug);
    return orderTransformer.getOrder(repositoryResponse);
  },
  orders: async (slug: string, data: GetOrdersSchemaType) => {
    const { take, date, cursor, type, types, status, statuses } = data;
    const skip = Number(data.skip) || 0;
    const props: any = {
      where: {
        store: {
          slug,
        },
      },
      take: Number(take) || 10,
      orderBy: {
        shortId: 'desc',
      },
      // include: {
      //   items: true,
      // },
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
      props.skip = skip >= 0 ? skip : 0;
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
    return repositoryResponse.map(orderTransformer.getTableOrder);
  },
  recentOrders: async (slug: string) => {
    const repositoryResponse = (await orderRepository.findManyRecentStoreSlug(slug)) as any[];
    return repositoryResponse.map(orderTransformer.getOrder);
  },
  openOrders: async (slug: string) => {
    const repositoryResponse = (await orderRepository.findManyOpenByStoreSlug(slug)) as any[];
    return repositoryResponse.map(orderTransformer.getOrder);
  },
  upsert: async (slug: string, data: OrderUpsertSchemaType, userId: string) => {
    const { shortId, items, note, ...orderInput } = data;
    let repositoryResponse: any = null;

    const enableKitchenCategory = Boolean(data.enableKitchenCategory);
    const scheduledData = data.scheduledAt
      ? {
          placedAt: dateTime.getDate(data.scheduledAt),
          scheduledAt: dateTime.getDate(),
        }
      : {};
    const input = orderTransformer.getOrderUpsert(orderInput);
    const itemsInput = items.map((e: any) =>
      itemTransformer.createConnectItem(
        {
          ...e,
          ...scheduledData,
        },
        userId
      )
    );

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
      const existingDraftItems = fetchedOrder.items.filter((item) => !item.placedAt);
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

    const tokens = await tokenService.createManyOneByOne(
      slug,
      repositoryResponse.id,
      repositoryResponse?.items,
      userId,
      enableKitchenCategory,
      { ...scheduledData, note: note ? note : null }
    );

    return orderTransformer.getOrder({
      ...repositoryResponse,
      tokens: [...(repositoryResponse.tokens || []), tokens],
    });
  },
  delete: async (slug: string, id: string) => {
    const repositoryResponse = await orderRepository.deleteById(slug, id);
    return repositoryResponse;
  },
};
