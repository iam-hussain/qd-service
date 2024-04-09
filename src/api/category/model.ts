import { z } from 'zod';

import { commonValidations } from '@/utils/common-validation';

export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;

export const CategoryCreateSchema = z.object({
  name: z.string(),
  deck: z.string().optional(),
  position: z.number().optional(),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().optional(),
  deck: z.string().optional(),
  position: z.number().optional(),
});

export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;

export const GetCategorySchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
