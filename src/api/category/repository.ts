import { CategoryCreateSchemaType, CategoryUpdateSchemaType } from '@iam-hussain/qd-copilot';

import idGenerator from '@/libs/id-generator';
import database from '@/providers/database';

import { productRepository } from '../product/repository';

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
  create: (slug: string, data: CategoryCreateSchemaType) => {
    return database.category.create({
      data: {
        ...data,
        id: idGenerator.generateShortID(),
        shortId: idGenerator.generateShortID(),
        store: {
          connect: {
            slug,
          },
        },
      },
    });
  },
  update: (slug: string, id: string, data: CategoryUpdateSchemaType) => {
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
    const connected = await productRepository.countByCategory(id, slug);
    if (connected > 0) {
      throw new Error('CANNOT_DELETE');
    }
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
