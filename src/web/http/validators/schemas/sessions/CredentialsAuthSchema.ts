import z from 'zod';

export const CredentialsAuthSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CredentialsAuthBody = z.infer<typeof CredentialsAuthSchema>;
