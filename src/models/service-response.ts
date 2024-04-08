import { z } from 'zod';

export enum ResponseStatus {
  Success,
  Failed,
}

export class ServiceResponse<T = null> {
  success: boolean;
  message: string;
  payload: T;
  code: number;

  constructor(status: ResponseStatus, message: string, payload: T, statusCode: number) {
    this.success = status === ResponseStatus.Success;
    this.message = message;
    this.payload = payload;
    this.code = statusCode;
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    payload: dataSchema.optional(),
    code: z.number(),
  });
