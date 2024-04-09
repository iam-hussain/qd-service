import database from '@/providers/database';

export const itemRepository = {
  createMany: async (data: any) => {
    return database.item.createMany({
      data,
      skipDuplicates: true,
    });
  },
  deleteManyByIds: async (data: string[]) => {
    return database.item.deleteMany({
      where: {
        id: {
          in: data,
        },
      },
    });
  },
};
