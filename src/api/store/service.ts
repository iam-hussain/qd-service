import { mergeFeatureFlags } from '@iam-hussain/qd-copilot';

import { storeRepository } from '../store/repository';
import { storeTransformer } from './transformer';

export const storeService = {
  stores: async (id: string, type: 'SELLER' | 'CUSTOMER') => {
    const stores = await storeRepository.findManyByUser(id, type);
    return stores || [];
  },
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

    return storeRepository.updateAdditional(
      {
        id: store.id,
      },
      {
        tables: {
          set: data.tables as any,
        },
        fees: {
          set: data.fees as any,
        },
        taxes: {
          set: data.taxes as any,
        },
      }
    );
  },
  featureFlag: async (slug: string, input: any) => {
    const store = await storeRepository.findBySlug(slug);
    if (!store) {
      throw new Error('INVALID_STORE');
    }

    const featureFlags = mergeFeatureFlags(store.featureFlags, input);

    await storeRepository.update(
      {
        id: store.id,
      },
      {
        featureFlags,
      }
    );
    return featureFlags;
  },
};
