
import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  level: z.string().min(1, { message: "Level is required" }),
  skill: z.string().min(1, { message: "Skill is required" }),
  durationType: z.enum(["fixed", "recurring"]),
  durationValue: z.string().optional(),
  durationMetric: z.enum(["days", "weeks", "months", "years"]).optional(),
  image: z.string().url({ message: "Must be a valid URL" }),
  instructors: z.array(z.string()).min(1, { message: "At least one instructor is required" }),
  class_types_data: z.array(z.object({
    class_type_id: z.string(),
    quantity: z.number()
  })).optional(),
  base_price: z.number().min(0, { message: "Base price must be 0 or greater" }),
  is_gst_applicable: z.boolean(),
  gst_rate: z.number().min(0).max(100).optional(),
  discount_metric: z.enum(["percentage", "fixed"]),
  discount_value: z.number().min(0).optional(),
  discount_validity: z.string().optional(),
  discount_code: z.string().optional(),
  course_type: z.enum(["solo", "duo", "group"]),
}).refine((data) => {
  if (data.durationType === 'fixed') {
    return !!data.durationValue && !!data.durationMetric;
  }
  return true;
}, {
  message: "Duration value and metric are required for fixed duration courses",
  path: ["durationValue"]
}).refine((data) => {
  if (data.is_gst_applicable) {
    return !!data.gst_rate;
  }
  return true;
}, {
  message: "GST rate is required when GST is applicable",
  path: ["gst_rate"]
});

export type CourseFormSchemaType = z.infer<typeof courseSchema>;
