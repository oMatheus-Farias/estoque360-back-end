import { Product } from '@application/entities/Product';
import { IProductRepository } from '@domain/contracts/repositories/IProductRepository';
import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class ProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return null;
    }

    return new Product({
      id: product.id,
      companyId: product.companyId,
      name: product.name,
      sku: product.sku,
      description: product.description,
      priceCost: product.priceCost,
      priceSale: product.priceSale,
      minimumStock: product.minimumStock,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { sku },
    });

    if (!product) {
      return null;
    }

    return new Product({
      id: product.id,
      companyId: product.companyId,
      name: product.name,
      sku: product.sku,
      description: product.description,
      priceCost: product.priceCost,
      priceSale: product.priceSale,
      minimumStock: product.minimumStock,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async findByCompanyId(companyId: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { companyId },
    });

    return products.map(
      (product) =>
        new Product({
          id: product.id,
          companyId: product.companyId,
          name: product.name,
          sku: product.sku,
          description: product.description,
          priceCost: product.priceCost,
          priceSale: product.priceSale,
          minimumStock: product.minimumStock,
          status: product.status,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }),
    );
  }

  async create(data: Product): Promise<{ id: string }> {
    const product = await prisma.product.create({
      data: {
        id: data.id,
        companyId: data.companyId,
        name: data.name,
        sku: data.sku,
        description: data.description,
        priceCost: data.priceCost,
        priceSale: data.priceSale,
        minimumStock: data.minimumStock,
        status: data.status,
      },
    });

    return { id: product.id };
  }

  async update(
    id: string,
    data: Partial<Pick<Product, 'name' | 'description' | 'priceCost' | 'priceSale' | 'minimumStock' | 'status'>>,
  ): Promise<{ id: string }> {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        priceCost: data.priceCost,
        priceSale: data.priceSale,
        minimumStock: data.minimumStock,
        status: data.status,
      },
    });

    return { id: product.id };
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}
