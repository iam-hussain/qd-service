import database from '@/providers/database';

export const userRepository = {
  findByEmail: async (email: string) => {
    return database.user.findFirst({
      where: {
        email,
      },
    });
  },
  findById: async (id: string) => {
    return database.user.findFirst({
      where: {
        id,
      },
    });
  },
  findByIdWithStore: async (id: string) => {
    return database.user.findFirst({
      where: {
        id,
      },
      include: {
        connections: {
          select: {
            store: {
              select: {
                slug: true,
                shortId: true,
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },
};
