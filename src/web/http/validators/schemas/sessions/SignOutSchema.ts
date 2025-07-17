import { z } from 'zod';

export const SignOutSchema = z.object({
  accountId: z.string({
    required_error: 'Account ID is required',
    invalid_type_error: 'Account ID must be a string',
  }),
});

export type SignOutBody = z.infer<typeof SignOutSchema>;
