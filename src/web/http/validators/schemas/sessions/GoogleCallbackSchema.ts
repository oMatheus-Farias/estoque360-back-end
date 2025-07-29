import { z } from 'zod';

export const GoogleCallbackSchema = z.object({
  code: z
    .string({
      required_error: 'Authorization code is required',
      invalid_type_error: 'Authorization code must be a string',
    })
    .min(1, 'Authorization code cannot be empty'),
});

export type GoogleCallbackBody = z.infer<typeof GoogleCallbackSchema>;
