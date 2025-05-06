
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { updateCourse } from './courseService';
import CourseForm from './CourseForm';
import { useCourseToastAdapter } from './hooks/useCourseToastAdapter';
import { Course } from '@/types/course';
import { useTeachers } from '@/hooks/useTeachers';
import { useSkills } from '@/hooks/useSkills';

// Import the CourseFormValues type from CourseForm
import type { CourseFormValues } from './CourseForm';

const courseSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z.string().optional(),
  level: z.string().optional(),
  skill: z.string().optional(),
  durationType: z.union([z.literal("fixed"), z.literal("recurring")]).optional(),
  durationValue: z.string().optional(),
  durationMetric: z.union([z.literal("days"), z.literal("weeks"), z.literal("months"), z.literal("years")]).optional(),
  base_price: z.number().optional(),
  is_gst_applicable: z.boolean().optional(),
  gst_rate: z.number().optional(),
  discount_metric: z.union([z.literal("percentage"), z.literal("fixed")]).optional(),
  discount_value: z.number().optional(),
  discount_validity: z.string().optional(),
  discount_code: z.string().optional(),
  image: z.string().optional().default("https://via.placeholder.com/300x200?text=Course"),
  instructors: z.array(z.string()).optional().default([]),
  class_types_data: z.array(z.object({
    class_type_id: z.string(),
    quantity: z.number()
  })).optional().default([]),
});

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onSuccess: () => void;
}

const EditCourseDialog = ({
  open,
  onOpenChange,
  course,
  onSuccess,
}: EditCourseDialogProps) => {
  const { showSuccessToast, showErrorToast } = useCourseToastAdapter();
  const { teachers } = useTeachers();
  const { skills } = useSkills();
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      level: course?.level || '',
      skill: course?.skill || '',
      durationType: (course?.duration_type as "fixed" | "recurring") || "fixed",
      durationValue: course?.duration || '',
      durationMetric: "days",
      base_price: course?.base_price || 0,
      is_gst_applicable: course?.is_gst_applicable || false,
      gst_rate: course?.gst_rate || 0,
      discount_metric: (course?.discount_metric as "percentage" | "fixed") || "percentage",
      discount_value: course?.discount_value || 0,
      discount_validity: course?.discount_validity || '',
      discount_code: course?.discount_code || '',
      image: course?.image || "https://via.placeholder.com/300x200?text=Course",
      instructors: course?.instructor_ids || [],
      class_types_data: course?.class_types_data || [],
    },
  });

  // Update form values when course changes
  React.useEffect(() => {
    if (course) {
      form.reset({
        title: course.title || '',
        description: course.description || '',
        level: course.level || '',
        skill: course.skill || '',
        durationType: (course.duration_type as "fixed" | "recurring") || "fixed",
        durationValue: course.duration || '',
        durationMetric: "days",
        base_price: course.base_price || 0,
        is_gst_applicable: course.is_gst_applicable || false,
        gst_rate: course.gst_rate || 0,
        discount_metric: (course.discount_metric as "percentage" | "fixed") || "percentage",
        discount_value: course.discount_value || 0,
        discount_validity: course.discount_validity || '',
        discount_code: course.discount_code || '',
        image: course.image || "https://via.placeholder.com/300x200?text=Course",
        instructors: course.instructor_ids || [],
        class_types_data: course.class_types_data || [],
      });
    }
  }, [course, form]);

  const onSubmit = async (data: CourseFormValues) => {
    try {
      // Transform form data to course data
      const courseData = {
        title: data.title,
        description: data.description || '',
        level: data.level || '',
        skill: data.skill || '',
        duration_type: data.durationType || 'fixed',
        duration: data.durationValue || '0',
        base_price: data.base_price,
        is_gst_applicable: data.is_gst_applicable,
        gst_rate: data.gst_rate,
        discount_metric: data.discount_metric,
        discount_value: data.discount_value,
        discount_validity: data.discount_validity,
        discount_code: data.discount_code,
        image: data.image,
        instructor_ids: data.instructors,
        class_types_data: data.class_types_data,
      };
      
      await updateCourse(course.id, courseData);
      showSuccessToast('Course updated successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating course:', error);
      showErrorToast('Failed to update course. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CourseForm 
              form={form} 
              teachers={teachers || []}
              skills={skills || []}
              onSubmit={onSubmit}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Course</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
