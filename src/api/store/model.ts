import { z } from 'zod';

export const CALC_VALUE_TYPE = z.enum(['VALUE', 'PERCENTAGE', 'VALUE_COUNT']);

export type Fee = z.infer<typeof FeeSchema>;
export const FeeSchema = z.object({
  key: z.string(),
  name: z.string(),
  rate: z.number(),
  printName: z.string().optional(),
  position: z.number().optional(),
  type: CALC_VALUE_TYPE.optional(),
});

export type Fees = z.infer<typeof FeesSchema>;
export const FeesSchema = z.array(FeeSchema).optional();

export type Table = z.infer<typeof TableSchema>;
export const TableSchema = z.object({
  key: z.string(),
  name: z.string(),
  printName: z.string().optional(),
  position: z.number().optional(),
});

export type Tables = z.infer<typeof TablesSchema>;
export const TablesSchema = z.array(TableSchema).optional();

export const AdditionalSchema = z.object({
  body: z.object({
    fees: FeesSchema,
    taxes: FeesSchema,
    tables: TablesSchema,
  }),
});
