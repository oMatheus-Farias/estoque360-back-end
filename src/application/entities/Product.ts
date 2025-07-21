import KSUID from 'ksuid';

export class Product {
  readonly id: string;
  readonly companyId: string;
  readonly name: string;
  readonly sku: string;
  readonly description: string | null;
  readonly priceCost: number;
  readonly priceSale: number;
  readonly minimumStock: number;
  readonly status: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(attr: Product.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.companyId = attr.companyId;
    this.name = attr.name;
    this.sku = attr.sku ?? KSUID.randomSync().string;
    this.description = attr.description ?? null;
    this.priceCost = attr.priceCost;
    this.priceSale = attr.priceSale;
    this.minimumStock = attr.minimumStock;
    this.status = attr.status ?? true;
    this.createdAt = attr.createdAt ?? new Date();
    this.updatedAt = attr.updatedAt ?? new Date();
  }

  static create(data: Product.CreateData): Product {
    return new Product({
      companyId: data.companyId,
      name: data.name,
      description: data.description,
      priceCost: data.priceCost,
      priceSale: data.priceSale,
      minimumStock: data.minimumStock,
    });
  }
}

export namespace Product {
  export type Attributes = {
    id?: string;
    companyId: string;
    name: string;
    sku?: string;
    description?: string | null;
    priceCost: number;
    priceSale: number;
    minimumStock: number;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };

  export type CreateData = {
    companyId: string;
    name: string;
    description?: string | null;
    priceCost: number;
    priceSale: number;
    minimumStock: number;
  };
}
