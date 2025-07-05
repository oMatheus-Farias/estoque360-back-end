import z from 'zod';

export const CreateAccountSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'COLLABORATOR']).default('COLLABORATOR'),
});

export type CreateAccountBody = z.infer<typeof CreateAccountSchema>;
