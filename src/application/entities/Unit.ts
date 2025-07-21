import KSUID from 'ksuid';

export class Unit {
  readonly id: string;
  readonly companyId: string;
  readonly name: string;
  readonly address: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly phone: string | null;
  readonly status: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(attr: Unit.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.companyId = attr.companyId;
    this.name = attr.name;
    this.address = attr.address;
    this.city = attr.city;
    this.state = attr.state;
    this.zipCode = attr.zipCode;
    this.phone = attr.phone ?? null;
    this.status = attr.status ?? true;
    this.createdAt = attr.createdAt ?? new Date();
    this.updatedAt = attr.updatedAt ?? new Date();
  }

  static create(data: Unit.CreateData): Unit {
    return new Unit({
      companyId: data.companyId,
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      phone: data?.phone,
    });
  }
}

export namespace Unit {
  export type Attributes = {
    id?: string;
    companyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string | null;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };

  export type CreateData = {
    companyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string | null;
  };
}
