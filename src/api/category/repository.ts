import database from '@/providers/database';

export const storeRepository = {
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
};
