import { $Enums } from 'generated/prisma/client';

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
