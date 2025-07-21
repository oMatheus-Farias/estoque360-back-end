import { z } from 'zod';

export const CreateUnitSchema = z.object({
  companyId: z
    .string({
      required_error: 'Company ID is required',
      message: 'Company ID is required',
    })
    .min(1, 'Company ID is required'),
  name: z
    .string({
      required_error: 'Name is required',
      message: 'Name is required',
    })
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters long'),
  address: z
    .string({
      required_error: 'Address is required',
      message: 'Address is required',
    })
    .min(1, 'Address is required')
    .max(255, 'Address must be at most 255 characters long'),
  city: z
    .string({
      required_error: 'City is required',
      message: 'City is required',
    })
    .min(1, 'City is required')
    .max(100, 'City must be at most 100 characters long'),
  state: z
    .string({
      required_error: 'State is required',
      message: 'State is required',
    })
    .length(2, 'State must be exactly 2 characters long'),
  zipCode: z
    .string({
      required_error: 'Zip code is required',
      message: 'Zip code is required',
    })
    .length(8, 'Zip code must be exactly 8 characters long'),
  phone: z
    .string({
      required_error: 'Phone is optional',
      message: 'Phone is optional',
    })
    .max(15, 'Phone must be at most 15 characters long')
    .optional(),
});

export type CreateUnitBody = z.infer<typeof CreateUnitSchema>;
