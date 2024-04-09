import idGenerator from '@/libs/id-generator';
import database from '@/providers/database';

import { ProductCreate, ProductUpdate } from './model';

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
    });
  },
  create: (slug: string, { categoryId, ...data }: ProductCreate) => {
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
  update: (slug: string, id: string, { categoryId, ...data }: ProductUpdate) => {
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
