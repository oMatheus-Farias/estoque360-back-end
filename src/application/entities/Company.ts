import KSUID from 'ksuid';

export class Company {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly cnpj: string;
  readonly status: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(attr: Company.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.name = attr.name;
    this.email = attr.email;
    this.phone = attr.phone ?? null;
    this.cnpj = attr.cnpj;
    this.status = attr.status ?? true;
    this.createdAt = attr.createdAt ?? new Date();
    this.updatedAt = attr.updatedAt ?? new Date();
  }

  static create(data: Company.CreateData): Company {
    return new Company({
      name: data.name,
      email: data.email,
      phone: data?.phone,
      cnpj: data.cnpj,
    });
  }
}

export namespace Company {
  export type Attributes = {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    cnpj: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };

  export type CreateData = {
    name: string;
    email: string;
    phone?: string | null;
    cnpj: string;
  };
}
