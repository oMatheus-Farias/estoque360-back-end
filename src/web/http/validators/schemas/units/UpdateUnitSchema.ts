import { z } from 'zod';

export const UpdateUnitSchemaWithId = z.object({
  unitId: z.string().min(1),
});

export const UpdateUnitSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters long')
    .optional(),
  address: z
    .string({
      required_error: 'Address is required',
      message: 'Address is required',
    })
    .min(1, 'Address is required')
    .max(255, 'Address must be at most 255 characters long')
    .optional(),
  city: z
    .string({
      required_error: 'City is required',
      message: 'City is required',
    })
    .min(1, 'City is required')
    .max(100, 'City must be at most 100 characters long')
    .optional(),
  state: z
    .string({
      required_error: 'State is required',
      message: 'State is required',
    })
    .length(2, 'State must be exactly 2 characters long')
    .optional(),
  zipCode: z
    .string({
      required_error: 'Zip code is required',
      message: 'Zip code is required',
    })
    .length(8, 'Zip code must be exactly 8 characters long')
    .optional(),
  phone: z
    .string({
      required_error: 'Phone is optional',
      message: 'Phone is optional',
    })
    .max(15, 'Phone must be at most 15 characters long')
    .optional(),
  status: z
    .boolean({
      required_error: 'Status is optional',
      message: 'Status is optional',
    })
    .optional(),
});

export type UpdateUnitBody = z.infer<typeof UpdateUnitSchema>;
