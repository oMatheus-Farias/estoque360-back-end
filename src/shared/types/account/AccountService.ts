import { $Enums } from 'generated/prisma/client';

export type CreateAccountWithProfileInput = {
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
  role?: $Enums.Role;
};

export type CreateAccountWithProfileOutput = {
  account: {
    id: string;
  };
  profile: {
    id: string;
  };
};

export type AccountWithProfile = {
  account: {
    id: string;
    email: string;
    role: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  profile: {
    id: string;
    accountId: string;
    name: string;
    phone?: string | null;
    avatar?: string | null;
  };
};
