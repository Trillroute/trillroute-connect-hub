
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';
import { useTeachers } from '@/hooks/useTeachers';
import { ScrollArea } from '@/components/ui/scroll-area';
import CourseForm, { CourseFormValues } from './CourseForm';

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onSuccess: () => void;
}

const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  instructor: z.string().min(1, { message: "Instructor is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  image: z.string().url({ message: "Must be a valid URL" }),
});

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({ 
  open, 
  onOpenChange, 
  course, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const { teachers } = useTeachers();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      level: course.level,
      category: course.category,
      duration: course.duration,
      image: course.image,
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        level: course.level,
        category: course.category,
        duration: course.duration,
        image: course.image,
      });
    }
  }, [course, form, open]);

  const handleUpdateCourse = async (data: CourseFormValues) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: data.title,
          description: data.description,
          instructor: data.instructor,
          level: data.level,
          category: data.category,
          duration: data.duration,
          image: data.image,
          status: 'Active',
        })
        .eq('id', course.id);
        
      if (error) {
        console.error('Error updating course:', error);
        toast({
          title: 'Error',
          description: 'Failed to update course. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      onOpenChange(false);
      onSuccess();
      
      toast({
        title: "Course Updated",
        description: `${data.title} has been successfully updated`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the course information below.
            </DialogDescription>
          </DialogHeader>
          
          <CourseForm 
            form={form} 
            onSubmit={handleUpdateCourse} 
            teachers={teachers}
            submitButtonText="Update Course"
            cancelAction={() => onOpenChange(false)}
          />
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-music-500 hover:bg-music-600"
              onClick={form.handleSubmit(handleUpdateCourse)}
            >
              Update Course
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
