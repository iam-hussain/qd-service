import { OrderUpsertSchemaType } from '@iam-hussain/qd-copilot';

import idGenerator from '@/libs/id-generator';
import { idSeries } from '@/libs/id-series';
import database from '@/providers/database';

export const orderRepository = {
  findByShortId: async (shortId: string, slug: string) => {
    return database.order.findUniqueOrThrow({
      where: {
        shortId,
        store: {
          slug,
        },
      },
      include: {
        items: true,
      },
    });
  },
  findManyByStoreSlug: async (data: any) => {
    return database.order.findMany(data);
  },

  create: async (slug: string, data: any, userId: string) => {
    const response = await database.order.create({
      data: {
        id: idGenerator.generateShortID(),
        shortId: await idSeries.generateOrderId(slug),
        createdBy: {
          connect: {
            id: userId,
          },
        },
        store: {
          connect: {
            slug,
          },
        },
        ...data,
      },
    });
    idSeries.incrementOrderId(slug);
    return response;
  },
  update: (slug: string, shortId: string, data: Partial<OrderUpsertSchemaType>, userId: string) => {
    return database.order.update({
      where: {
        shortId,
        store: {
          slug,
        },
      },
      data: {
        ...(data as any),
        updatedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
  },
  deleteById: async (id: string, slug: string) => {
    return database.order.delete({
      where: {
        id,
        store: {
          slug,
        },
      },
    });
  },
};
