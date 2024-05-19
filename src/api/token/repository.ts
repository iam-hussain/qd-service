import database from '@/providers/database';

export const tokenRepository = {
  update: (where: any, data: any) => {
    return database.token.update({
      where,
      data,
    });
  },
  create: (data: any) => {
    return database.token.create({
      data: data,
    });
  },
};
