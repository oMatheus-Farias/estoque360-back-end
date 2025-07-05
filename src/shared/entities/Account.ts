import type { Role } from 'generated/prisma';

export type Account = {
  id: string;
  email: string;
  password: string;
  role: Role;
  status: boolean;
};
