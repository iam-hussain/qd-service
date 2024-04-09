import { z } from 'zod';

import { commonValidations } from '@/utils/common-validation';

import { ItemCreateSchema } from '../items/model';
import { FeesSchema, TableSchema } from '../store/model';

export const ORDER_TYPE = z.enum(['DINING', 'TAKE_AWAY', 'PICK_UP', 'DELIVERY', 'PLATFORM']);

export const ORDER_STATUS = z.enum([
  'DRAFT',
  'PLACED',
  'ACCEPTED',
  'PROGRESS',
  'READY',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
]);

export const OrderUpsertSchema = z.object({
  shortId: z.string().optional(),
  type: ORDER_TYPE.optional(),
  status: ORDER_STATUS.optional(),
  note: z.string().optional(),
  customerId: z.string().optional(),
  items: z.array(ItemCreateSchema).optional(),
  completedAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  fees: FeesSchema,
  table: TableSchema,
  taxes: FeesSchema,
});

export type OrderUpsert = z.infer<typeof OrderUpsertSchema>;

export const GetOrdersSchema = z.object({
  date: z.string().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
  cursor: z.string().optional(),
  type: ORDER_TYPE.optional(),
  status: ORDER_STATUS.optional(),
  types: z.array(ORDER_TYPE).optional(),
  statuses: z.array(ORDER_STATUS).optional(),
});

export type GetOrders = z.infer<typeof GetOrdersSchema>;

export const GetOrderSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
