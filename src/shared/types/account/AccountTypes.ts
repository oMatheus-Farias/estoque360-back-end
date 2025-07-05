import type { $Enums } from 'generated/prisma';

export type CreateAccountInput = {
  email: string;
  password: string;
  role?: $Enums.Role;
};

export type CreateProfileInput = {
  accountId: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
};
