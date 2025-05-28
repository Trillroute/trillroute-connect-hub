
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Course, DurationMetric, ClassTypeData } from '@/types/course';
import { CourseFormValues } from '../CourseForm';

const courseSchema = z.object({
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
  course_type: z.enum(["solo", "duo", "group"]),
  base_price: z.number().min(0, { message: "Base price must be positive" }),
  is_gst_applicable: z.boolean(),
  gst_rate: z.number().optional(),
  discount_metric: z.enum(["percentage", "fixed"]),
  discount_value: z.number().optional(),
  discount_validity: z.string().optional(),
  discount_code: z.string().optional(),
}).refine((data) => {
  if (data.durationType === 'fixed') {
    return !!data.durationValue && !!data.durationMetric;
  }
  return true;
}, {
  message: "Duration value and metric are required for fixed duration courses",
  path: ["durationValue"]
});

const parseDuration = (duration: string, durationType: string): { value: string, metric: DurationMetric } => {
  if (durationType !== 'fixed' || !duration) {
    return { value: '0', metric: 'weeks' };
  }
  const parts = duration.split(' ');
  const value = parts[0] || '0';
  let metric: DurationMetric = 'weeks';
  if (parts[1]) {
    const metricLower = parts[1].toLowerCase();
    if (['days', 'weeks', 'months', 'years'].includes(metricLower)) {
      metric = metricLower as DurationMetric;
    }
  }
  return { value, metric };
};

export function useEditCourseForm(course: Course, open: boolean) {
  const instructorIds = Array.isArray(course.instructor_ids) ? course.instructor_ids : [];
  const classTypesData = Array.isArray(course.class_types_data) 
    ? (course.class_types_data as unknown as ClassTypeData[]) 
    : [];

  const { value: durationValue, metric: durationMetric } = parseDuration(
    course.duration, 
    course.duration_type
  );

  const durationType: "fixed" | "recurring" = 
    (course.duration_type === "fixed" || course.duration_type === "recurring") 
      ? course.duration_type as "fixed" | "recurring" 
      : "fixed";

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      level: course.level,
      skill: course.skill,
      durationValue: durationValue,
      durationMetric: durationMetric,
      durationType: durationType,
      image: course.image,
      instructors: instructorIds,
      class_types_data: classTypesData || [],
      course_type: (course.course_type as "solo" | "duo" | "group") || "group",
      base_price: course.base_price || 0,
      is_gst_applicable: course.is_gst_applicable || false,
      gst_rate: course.gst_rate || 0,
      discount_metric: (course.discount_metric as "percentage" | "fixed") || "percentage",
      discount_value: course.discount_value || 0,
      discount_validity: course.discount_validity || '',
      discount_code: course.discount_code || ''
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: course.title,
        description: course.description,
        level: course.level,
        skill: course.skill,
        durationValue: durationValue,
        durationMetric: durationMetric,
        durationType: durationType,
        image: course.image,
        instructors: instructorIds,
        class_types_data: classTypesData || [],
        course_type: (course.course_type as "solo" | "duo" | "group") || "group",
        base_price: course.base_price || 0,
        is_gst_applicable: course.is_gst_applicable || false,
        gst_rate: course.gst_rate || 0,
        discount_metric: (course.discount_metric as "percentage" | "fixed") || "percentage",
        discount_value: course.discount_value || 0,
        discount_validity: course.discount_validity || '',
        discount_code: course.discount_code || ''
      });
    }
  }, [course, open, durationValue, durationMetric, durationType, form, classTypesData]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('EditCourseDialog - Form values updated:', value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return form;
}
