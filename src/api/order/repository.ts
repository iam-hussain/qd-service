import { OrderUpsertSchemaType } from '@iam-hussain/qd-copilot';

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
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000); // Calculate 5 hours ago

    return database.order.findMany({
      where: {
        store: {
          slug,
        },
        OR: [
          {
            createdAt: {
              gt: fiveHoursAgo,
            },
          },
          {
            status: { in: ['DELIVERY_PENDING', 'DELIVERED', 'DRAFT', 'IN_PROGRESS'] },
          },
        ],
      },
      orderBy: {
        shortId: 'desc',
      },
      include: {
        items: true,
      },
    });
  },
  findManyRecentStoreSlug: async (slug: string) => {
    return database.order.findMany({
      where: {
        store: {
          slug,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
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
