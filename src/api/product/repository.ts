import { ProductCreateSchemaType, ProductUpdateSchemaType } from '@iam-hussain/qd-copilot';

import idGenerator from '@/libs/id-generator';
import database from '@/providers/database';

export const productRepository = {
  countByCategory: async (id: string, slug: string) => {
    return database.product.count({
      where: {
        store: {
          slug,
        },
        OR: [
          {
            categoryId: id,
          },
          {
            kitchenCategoryId: id,
          },
        ],
      },
    });
  },
  findById: async (id: string, slug: string) => {
    return database.product.findMany({
      where: {
        id,
        store: {
          slug,
        },
      },
      include: {
        category: true,
        kitchenCategory: true,
      },
    });
  },
  findManyByStoreSlug: async (slug: string) => {
    return database.product.findMany({
      where: {
        store: {
          slug,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  create: (slug: string, { categoryId, kitchenCategoryId, ...data }: ProductCreateSchemaType) => {
    return database.product.create({
      data: {
        ...data,
        shortId: idGenerator.generateShortID(),
        store: {
          connect: {
            slug,
          },
        },
        category: {
          connect: {
            id: categoryId,
          },
        },
        ...(kitchenCategoryId
          ? {
              kitchenCategory: {
                connect: {
                  id: kitchenCategoryId,
                },
              },
            }
          : {}),
      },
    });
  },
  update: (slug: string, id: string, { categoryId, kitchenCategoryId, ...data }: ProductUpdateSchemaType) => {
    return database.product.update({
      where: {
        id,
        store: {
          slug,
        },
      },
      data: {
        ...data,
        ...(categoryId
          ? {
              category: {
                connect: {
                  id: categoryId,
                },
              },
            }
          : {}),
        ...(kitchenCategoryId
          ? {
              kitchenCategory: {
                connect: {
                  id: kitchenCategoryId,
                },
              },
            }
          : {}),
      },
    });
  },
  deleteById: async (id: string, slug: string) => {
    return database.product.delete({
      where: {
        id,
        store: {
          slug,
        },
      },
    });
  },
};
