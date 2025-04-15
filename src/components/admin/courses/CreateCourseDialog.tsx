import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTeachers } from '@/hooks/useTeachers';
import { useSkills } from '@/hooks/useSkills';
import CourseForm, { CourseFormValues } from './CourseForm';
import { DurationMetric } from '@/types/course';

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  instructors: z.array(z.string()).min(1, { message: "At least one instructor is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  durationType: z.enum(["fixed", "recurring"]),
  durationValue: z.string().optional(),
  durationMetric: z.enum(["days", "weeks", "months", "years"]).optional(),
  image: z.string().url({ message: "Must be a valid URL" }),
}).refine((data) => {
  // If durationType is fixed, require durationValue and durationMetric
  if (data.durationType === 'fixed') {
    return !!data.durationValue && !!data.durationMetric;
  }
  return true;
}, {
  message: "Duration value and metric are required for fixed duration courses",
  path: ["durationValue"]
});

const CreateCourseDialog: React.FC<CreateCourseDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { toast } = useToast();
  const { teachers = [] } = useTeachers();
  const { skills = [] } = useSkills();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      instructors: [],
      level: 'Beginner',
      category: '',
      durationValue: '0',
      durationMetric: 'weeks',
      durationType: 'fixed',
      image: '',
    }
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        title: '',
        description: '',
        instructors: [],
        level: 'Beginner',
        category: '',
        durationValue: '0',
        durationMetric: 'weeks',
        durationType: 'fixed',
        image: '',
      });
    }
  }, [open, form]);

  const handleCreateCourse = async (data: CourseFormValues) => {
    try {
      console.log('Creating course with data:', data);
      
      // Format the duration string based on the type and values
      let duration = '';
      if (data.durationType === 'fixed' && data.durationValue && data.durationMetric) {
        duration = `${data.durationValue} ${data.durationMetric}`;
      } else {
        duration = 'Recurring';
      }
      
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert([
          {
            title: data.title,
            description: data.description,
            level: data.level,
            category: data.category,
            duration: duration,
            duration_type: data.durationType,
            image: data.image,
            status: 'Active',
            students: 0,
            instructor_ids: Array.isArray(data.instructors) ? data.instructors : []
          }
        ])
        .select()
        .single();
        
      if (courseError) {
        console.error('Error creating course:', courseError);
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
          skills={skills}
          submitButtonText="Create Course"
          cancelAction={() => onOpenChange(false)}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            type="submit" 
            className="bg-music-500 hover:bg-music-600"
            onClick={form.handleSubmit(handleCreateCourse)}
          >
            Create Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;
