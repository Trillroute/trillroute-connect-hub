
import * as z from 'zod';

export const profileSchema = z.object({
  dateOfBirth: z.string().optional(),
  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  whatsappEnabled: z.boolean().optional(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  guardianRelation: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
