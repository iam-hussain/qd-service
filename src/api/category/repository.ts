import idGenerator from '@/libs/id-generator';
import database from '@/providers/database';

import { CategoryCreate, CategoryUpdate } from './model';

export const categoryRepository = {
  findById: async (id: string, slug: string) => {
    return database.category.findMany({
      where: {
        id,
        store: {
          slug,
        },
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  },
  findManyByStoreSlug: async (slug: string) => {
    return database.category.findMany({
      where: {
        store: {
          slug,
        },
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },
  create: (slug: string, data: CategoryCreate) => {
    return database.category.create({
      data: {
        ...data,
        shortId: idGenerator.generateShortID(),
        store: {
          connect: {
            slug,
          },
        },
      },
    });
  },
  update: (slug: string, id: string, data: CategoryUpdate) => {
    return database.category.update({
      where: {
        id,
        store: {
          slug,
        },
      },
      data,
    });
  },
  deleteById: async (id: string, slug: string) => {
    return database.category.delete({
      where: {
        id,
        store: {
          slug,
        },
      },
    });
  },
};
