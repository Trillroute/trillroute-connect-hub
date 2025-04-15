
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTeachers } from '@/hooks/useTeachers';
import { ScrollArea } from '@/components/ui/scroll-area';
import CourseForm, { CourseFormValues } from './CourseForm';

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const CreateCourseDialog: React.FC<CreateCourseDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { toast } = useToast();
  const { teachers } = useTeachers();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      instructor: '',
      level: 'Beginner',
      category: '',
      duration: '',
      image: '',
    }
  });

  const handleCreateCourse = async (data: CourseFormValues) => {
    try {
      const { error } = await supabase
        .from('courses')
        .insert([
          {
            title: data.title,
            description: data.description,
            instructor: data.instructor,
            level: data.level,
            category: data.category,
            duration: data.duration,
            image: data.image,
            status: 'Active', // Hardcoded to Active since draft field is removed
            students: 0
          }
        ]);
        
      if (error) {
        console.error('Error creating course:', error);
        toast({
          title: 'Error',
          description: 'Failed to create course. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      onOpenChange(false);
      form.reset();
      onSuccess();
      
      toast({
        title: "Course Created",
        description: `${data.title} has been successfully created`,
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
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Create a new course by filling out the information below.
            </DialogDescription>
          </DialogHeader>
          
          <CourseForm 
            form={form} 
            onSubmit={handleCreateCourse} 
            teachers={teachers} 
            submitButtonText="Create Course"
            cancelAction={() => onOpenChange(false)}
          />
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button 
              type="submit" 
              className="bg-music-500 hover:bg-music-600"
              onClick={form.handleSubmit(handleCreateCourse)}
            >
              Create Course
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;
