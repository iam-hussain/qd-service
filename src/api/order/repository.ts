import { OrderUpsertSchemaType } from '@iam-hussain/qd-copilot';

import dateTime from '@/libs/date-time';
import { idSeries } from '@/libs/id-series';
import database from '@/providers/database';

export const orderRepository = {
  findByShortId: async (shortId: string, slug: string) => {
    return database.order.findUnique({
      where: {
        shortId,
        store: {
          slug,
        },
      },
      include: {
        items: true,
        tokens: true,
      },
    });
  },

  findManyByStoreSlug: async (data: any) => {
    return database.order.findMany(data);
  },

  findManyOpenByStoreSlug: async (slug: string) => {
    return database.order.findMany({
      where: {
        store: {
          slug,
        },
        OR: [
          {
            createdAt: {
              gte: dateTime.getTodayStart(),
              lte: dateTime.getTodayEnd(),
            },
            status: { in: ['DELIVERY_PENDING', 'DELIVERED', 'DRAFT', 'IN_PROGRESS'] },
          },
        ],
      },
      orderBy: {
        shortId: 'desc',
      },
      include: {
        items: {
          select: {
            tokens: {
              select: {
                shortId: true,
              },
            },
          },
        },
      },
    });
  },

  create: async (slug: string, data: any, userId: string) => {
    const response = await database.order.create({
      data: {
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
      include: {
        items: {
          include: {
            product: {
              select: {
                kitchenCategoryId: true,
              },
            },
          },
        },
        tokens: true,
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
      include: {
        items: {
          include: {
            product: {
              select: {
                kitchenCategoryId: true,
              },
            },
          },
        },
        tokens: true,
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
