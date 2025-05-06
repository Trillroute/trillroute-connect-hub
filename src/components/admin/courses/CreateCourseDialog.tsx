
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { createCourse } from './courseService';
import CourseForm from './CourseForm';
import { useCourseToastAdapter } from './hooks/useCourseToastAdapter';
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

// Make sure this type matches with CourseFormValues
type FormValues = z.infer<typeof courseSchema>;

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateCourseDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateCourseDialogProps) => {
  const { showSuccessToast, showErrorToast } = useCourseToastAdapter();
  const { teachers } = useTeachers();
  const { skills } = useSkills();
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      level: '',
      skill: '',
      durationType: "fixed",
      durationValue: '',
      durationMetric: "days",
      base_price: 0,
      is_gst_applicable: false,
      gst_rate: 0,
      discount_metric: "percentage",
      discount_value: 0,
      discount_validity: '',
      discount_code: '',
      image: "https://via.placeholder.com/300x200?text=Course",
      instructors: [],
      class_types_data: [],
    },
  });

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
        image: data.image || "https://via.placeholder.com/300x200?text=Course",
        instructor_ids: data.instructors || [],
        class_types_data: data.class_types_data || [],
      };

      await createCourse(courseData);
      showSuccessToast('Course created successfully');
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating course:', error);
      showErrorToast('Failed to create course. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
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
              <Button type="submit">Create Course</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;
