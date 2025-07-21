import { z } from 'zod';

export const CreateProductSchema = z.object({
  companyId: z
    .string({
      required_error: 'Company ID is required',
      message: 'Company ID must be a valid string',
    })
    .min(1, 'Company ID is required'),
  name: z
    .string({
      required_error: 'Name is required',
      message: 'Name must be a valid string',
    })
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters long'),
  description: z
    .string({
      required_error: 'Description is required',
      message: 'Description must be a valid string',
    })
    .max(255, 'Description must be at most 500 characters long')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  priceCost: z
    .number({
      required_error: 'Price cost is required',
      message: 'Price cost must be a valid number',
    })
    .positive('Price cost must be a positive number'),
  priceSale: z
    .number({
      required_error: 'Price sale is required',
      message: 'Price sale must be a valid number',
    })
    .positive('Price sale must be a positive number'),
  minimumStock: z
    .number({
      required_error: 'Minimum stock is required',
      message: 'Minimum stock must be a valid number',
    })
    .int()
    .nonnegative('Minimum stock must be a non-negative integer'),
});

export type CreateProductBody = z.infer<typeof CreateProductSchema>;
