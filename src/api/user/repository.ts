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
};
