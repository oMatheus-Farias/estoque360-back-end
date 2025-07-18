import { z } from 'zod';

export const CreateCompanySchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name is required'),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(1, 'Email is required'),
  phone: z
    .string({
      invalid_type_error: 'Phone must be a string',
    })
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  cnpj: z
    .string({
      required_error: 'CNPJ is required',
      invalid_type_error: 'CNPJ must be a string',
    })
    .length(14, 'CNPJ must be exactly 14 characters'),
});

export type CreateCompanyBody = z.infer<typeof CreateCompanySchema>;
