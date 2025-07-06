import KSUID from 'ksuid';

export class Profile {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly phone?: string | null;
  readonly avatar?: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(attr: Profile.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.phone = attr.phone ?? null;
    this.avatar = attr.avatar ?? null;
    this.createdAt = attr.createdAt ?? new Date();
    this.updatedAt = attr.updatedAt ?? new Date();
  }

  static create(data: Profile.CreateData): Profile {
    return new Profile({
      accountId: data.accountId,
      name: data.name,
      phone: data.phone,
      avatar: data.avatar,
    });
  }

  // Método para verificar se tem telefone
  hasPhone(): boolean {
    return !!this.phone;
  }

  // Método para verificar se tem avatar
  hasAvatar(): boolean {
    return !!this.avatar;
  }

  // Método para obter iniciais do nome
  getInitials(): string {
    return this.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
}

export namespace Profile {
  export type Attributes = {
    accountId: string;
    name: string;
    phone?: string | null;
    avatar?: string | null;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };

  export type CreateData = {
    accountId: string;
    name: string;
    phone?: string | null;
    avatar?: string | null;
  };
}
