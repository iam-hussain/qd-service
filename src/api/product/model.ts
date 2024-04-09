import { z } from 'zod';

import { commonValidations } from '@/utils/common-validation';

const PRODUCT_TYPE = z.enum(['VEG', 'NON_VEG', 'VEGAN']);

export type ProductCreate = z.infer<typeof ProductCreateSchema>;

export const ProductCreateSchema = z.object({
  name: z.string(),
  deck: z.string().optional(),
  type: PRODUCT_TYPE.optional(),
  price: z.number(),
  categoryId: z.string(),
});

export const ProductUpdateSchema = z.object({
  name: z.string().optional(),
  deck: z.string().optional(),
  price: z.number().optional(),
  type: PRODUCT_TYPE.optional(),
  categoryId: z.string().optional(),
});

export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

export const GetProductSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
