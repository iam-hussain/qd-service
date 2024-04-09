import { z } from 'zod';

import { commonValidations } from '@/utils/common-validation';

import { PRODUCT_TYPE } from '../product/model';

export const ItemCreateSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  note: z.string().optional(),
  price: z.number().optional(),
  type: PRODUCT_TYPE.optional(),
  quantity: z.number(),
  position: z.number().optional(),
  productId: z.string(),
});

export type ItemCreate = z.infer<typeof ItemCreateSchema>;

export const GetItemSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
