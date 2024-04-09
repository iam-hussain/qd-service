import { ItemCreate } from '../items/model';
import { itemRepository } from '../items/repository';
import { itemTransformer } from '../items/transformer';
import { GetOrders, OrderUpsert } from './model';
import { orderRepository } from './repository';
import { orderTransformer } from './transformer';

export const orderService = {
  order: async (id: string, slug: string) => {
    const repositoryResponse = await orderRepository.findByShortId(id, slug);
    return repositoryResponse;
  },
  orders: async (slug: string, data: GetOrders) => {
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
    const repositoryResponse = await orderRepository.findManyByStoreSlug(props);
    return repositoryResponse;
  },
  upsert: async (slug: string, data: OrderUpsert, userId: string) => {
    const { shortId, items = [] } = data;
    const input = orderTransformer.getOrder(data);
    let repositoryResponse: any = null;
    const itemsInput: ItemCreate[] = [];

    if (shortId) {
      const fetchedOrder = await orderRepository.findByShortId(shortId, slug);

      if (!fetchedOrder || !fetchedOrder.id) {
        throw new Error('INVALID_INPUT');
      }
      repositoryResponse = orderRepository.update(slug, fetchedOrder.shortId, input, userId);
    } else {
      repositoryResponse = await orderRepository.create(slug, input, userId);
    }

    if (!repositoryResponse) {
      throw new Error('INVALID_INPUT');
    }

    items
      .filter((e) => !e.id)
      .forEach((e) => {
        itemsInput.push(itemTransformer.getItems(e, repositoryResponse.id, userId));
      });

    if (itemsInput.length) {
      await itemRepository.createMany(itemsInput);
    }

    return repositoryResponse;
  },
  delete: async (slug: string, id: string) => {
    const repositoryResponse = await orderRepository.deleteById(slug, id);
    return repositoryResponse;
  },
};