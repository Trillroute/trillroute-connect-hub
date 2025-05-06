
import React from 'react';
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

// Schema and types
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
  // Add other necessary fields
});

type CourseFormValues = z.infer<typeof courseSchema>;

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
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      level: course?.level || '',
      skill: course?.skill || '',
      durationType: (course?.duration_type as "fixed" | "recurring") || "fixed",
      base_price: course?.base_price || 0,
      is_gst_applicable: course?.is_gst_applicable || false,
      gst_rate: course?.gst_rate || 0,
      discount_metric: (course?.discount_metric as "percentage" | "fixed") || "percentage",
      discount_value: course?.discount_value || 0,
      discount_validity: course?.discount_validity || '',
      discount_code: course?.discount_code || '',
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
        base_price: course.base_price || 0,
        is_gst_applicable: course.is_gst_applicable || false,
        gst_rate: course.gst_rate || 0,
        discount_metric: (course.discount_metric as "percentage" | "fixed") || "percentage",
        discount_value: course.discount_value || 0,
        discount_validity: course.discount_validity || '',
        discount_code: course.discount_code || '',
      });
    }
  }, [course, form]);

  const onSubmit = async (data: CourseFormValues) => {
    try {
      await updateCourse(course.id, data);
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
            <CourseForm form={form} />
            
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
