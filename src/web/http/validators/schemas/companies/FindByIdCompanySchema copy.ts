import { z } from 'zod';

export const FindByIdCompanySchema = z.object({
  companyId: z
    .string({
      required_error: 'Company ID is required',
      invalid_type_error: 'Company ID must be a string',
    })
    .min(1),
});
