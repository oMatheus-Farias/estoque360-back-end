import KSUID from 'ksuid';

export class Account {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly role: Account.Role;
  readonly status: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(attr: Account.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.email = attr.email;
    this.password = attr.password ?? '';
    this.role = attr.role ?? Account.Role.COLLABORATOR;
    this.status = attr.status ?? true;
    this.createdAt = attr.createdAt ?? new Date();
    this.updatedAt = attr.updatedAt ?? new Date();
  }

  static create(data: Account.CreateData): Account {
    return new Account({
      email: data.email,
      password: data?.password,
      role: data.role,
    });
  }

  // Método para verificar se a conta está ativa
  isActive(): boolean {
    return this.status;
  }

  // Método para verificar se tem permissão admin
  isAdmin(): boolean {
    return this.role === Account.Role.ADMIN;
  }

  // Método para verificar se tem permissão de manager
  isManager(): boolean {
    return this.role === Account.Role.MANAGER || this.isAdmin();
  }
}

export namespace Account {
  export type Attributes = {
    email: string;
    password?: string | null;
    googleId?: string | null;
    role?: Account.Role;
    status?: boolean;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };

  export type CreateData = {
    email: string;
    password?: string | null;
    googleId?: string | null;
    role?: Account.Role;
  };

  export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    COLLABORATOR = 'COLLABORATOR',
  }
}
