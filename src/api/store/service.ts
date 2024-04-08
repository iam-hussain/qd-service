import database from '@/providers/database';

import { storeRepository } from '../store/repository';
import { storeTransformer } from './transformer';

export const storeService = {
  store: async (slug: string) => {
    const store = await storeRepository.findBySlug(slug);
    return store;
  },
  additional: async (slug: string, input: any) => {
    const store = await storeRepository.findBySlug(slug);
    if (!store) {
      throw new Error('INVALID_STORE');
    }

    const reqBody = storeTransformer.validateStoreAdditional(input);
    const storeData = storeTransformer.getStoreAdditional(store);
    const data = storeTransformer.mergeStoreAdditional(storeData, reqBody);

    return database.store.update({
      where: {
        id: store.id,
      },
      data: {
        tables: {
          set: data.tables as any,
        },
        fees: {
          set: data.fees as any,
        },
        taxes: {
          set: data.taxes as any,
        },
      },
    });
  },
};
