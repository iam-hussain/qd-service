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
        categoryId: id,
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
  create: (slug: string, { categoryId, ...data }: ProductCreateSchemaType) => {
    return database.product.create({
      data: {
        ...data,
        id: idGenerator.generateShortID(),
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
      },
    });
  },
  update: (slug: string, id: string, { categoryId, ...data }: ProductUpdateSchemaType) => {
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
