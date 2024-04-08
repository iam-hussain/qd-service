import { z } from 'zod';

export type SignIn = z.infer<typeof SignInSchema>;
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Input Validation for 'GET users/:id' endpoint
export const SignInReqSchema = z.object({
  body: SignInSchema,
});
