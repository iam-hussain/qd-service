import { TokenUpdateSchemaType } from '@iam-hussain/qd-copilot';

import database from '@/providers/database';

export const tokenRepository = {
  findTodayByShortId: async (slug: string, enableKitchenCategory: boolean = false) => {
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000); // Calculate 5 hours ago

    return database.token.findMany({
      where: {
        store: {
          slug,
        },
        OR: [
          {
            completedAt: {
              lt: fiveHoursAgo,
            },
          },
          {
            placedAt: {
              gt: new Date(),
            },
            completedAt: null,
          },
          {
            placedAt: {
              lt: new Date(),
            },
            completedAt: null,
          },
        ],
      },
      include: {
        items: true,
        kitchenCategory: enableKitchenCategory,
        order: {
          select: {
            id: true,
            status: true,
            type: true,
            shortId: true,
          },
        },
      },
    });
  },
  update: (slug: string, id: string, orderId: string, data: Partial<TokenUpdateSchemaType>, userId: string) => {
    return database.token.update({
      where: {
        id,
        orderId,
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
  create: (data: any) => {
    return database.token.create({
      data: data,
    });
  },
  createMany: (data: any[]) => {
    return database.token.createMany({
      data: data,
    });
  },
};
