import database from '@/providers/database';

export const storeRepository = {
  findManyByUser: async (id: string, type: 'SELLER' | 'CUSTOMER') => {
    return database.store.findMany({
      where: {
        connections: {
          some: {
            user: {
              id,
              type,
            },
          },
        },
      },
    });
  },
  findBySlug: async (slug: string) => {
    return database.store.findUnique({
      where: {
        slug,
      },
    });
  },
};
