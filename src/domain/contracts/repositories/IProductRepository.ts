import type { Product } from '@application/entities/Product';

export abstract class IProductRepository {
  abstract findById(id: string): Promise<Product | null>;
  abstract findBySku(sku: string): Promise<Product | null>;
  abstract findByCompanyId(companyId: string): Promise<Product[]>;
  abstract create(data: Product): Promise<{ id: string }>;
  abstract update(
    id: string,
    data: Partial<Pick<Product, 'name' | 'description' | 'priceCost' | 'priceSale' | 'minimumStock' | 'status'>>,
  ): Promise<{ id: string }>;
  abstract delete(id: string): Promise<void>;
}
