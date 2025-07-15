import z from 'zod';

export const CreateRefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type CreateRefreshTokenBody = z.infer<typeof CreateRefreshTokenSchema>;
