
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

// Schema and types
const courseSchema = z.object({
  // Define your schema...
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  // Add other fields as needed
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any; // Replace with proper type
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
      name: course?.name || '',
      description: course?.description || '',
      // Set other default values...
    },
  });

  // Update form values when course changes
  React.useEffect(() => {
    if (course) {
      form.reset({
        name: course.name || '',
        description: course.description || '',
        // Set other values...
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
