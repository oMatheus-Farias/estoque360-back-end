import { z } from 'zod';

export const UpdateCompanySchemaWithId = z.object({
  companyId: z.string().min(1),
});

export const UpdateCompanySchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name is required')
    .optional(),
  phone: z
    .string({
      invalid_type_error: 'Phone must be a string',
    })
    .optional()
    .transform((val) => (val === '' ? null : val)),
  status: z
    .boolean({
      invalid_type_error: 'Status must be a boolean',
    })
    .optional(),
});

export type UpdateCompanyBody = z.infer<typeof UpdateCompanySchema>;
