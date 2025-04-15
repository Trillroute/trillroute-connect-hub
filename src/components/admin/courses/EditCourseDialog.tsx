
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Course, DurationMetric } from '@/types/course';
import { useTeachers } from '@/hooks/useTeachers';
import { useSkills } from '@/hooks/useSkills';
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

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({ 
  open, 
  onOpenChange, 
  course, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const { teachers = [] } = useTeachers();
  const { skills = [] } = useSkills();
  const [isLoading, setIsLoading] = useState(false);

  // Get instructor IDs from the course
  const instructorIds = Array.isArray(course.instructor_ids) ? course.instructor_ids : [];

  // Parse the duration string into value and metric
  const parseDuration = (duration: string, durationType: string): { value: string, metric: DurationMetric } => {
    if (durationType !== 'fixed' || !duration) {
      return { value: '0', metric: 'weeks' };
    }
    
    const parts = duration.split(' ');
    const value = parts[0] || '0';
    // Default to 'weeks' if no valid metric is found
    let metric: DurationMetric = 'weeks';
    
    if (parts[1]) {
      const metricLower = parts[1].toLowerCase();
      if (['days', 'weeks', 'months', 'years'].includes(metricLower)) {
        metric = metricLower as DurationMetric;
      }
    }
    
    return { value, metric };
  };
  
  const { value: durationValue, metric: durationMetric } = parseDuration(
    course.duration, 
    course.duration_type
  );

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      instructors: instructorIds,
      level: course.level,
      category: course.category,
      durationValue: durationValue,
      durationMetric: durationMetric,
      durationType: course.duration_type || 'fixed',
      image: course.image,
    }
  });

  // Reset form when dialog opens with current course data
  useEffect(() => {
    if (open) {
      const { value, metric } = parseDuration(course.duration, course.duration_type);
      form.reset({
        title: course.title,
        description: course.description,
        instructors: instructorIds,
        level: course.level,
        category: course.category,
        durationValue: value,
        durationMetric: metric,
        durationType: course.duration_type || 'fixed',
        image: course.image,
      });
    }
  }, [course, form, open, instructorIds]);

  const handleUpdateCourse = async (data: CourseFormValues) => {
    try {
      setIsLoading(true);
      console.log('Updating course with data:', data);
      
      // Format the duration string based on the type and values
      let duration = '';
      if (data.durationType === 'fixed' && data.durationValue && data.durationMetric) {
        duration = `${data.durationValue} ${data.durationMetric}`;
      } else {
        duration = 'Recurring';
      }
      
      // Update the course with instructor IDs directly
      const { error: courseError } = await supabase
        .from('courses')
        .update({
          title: data.title,
          description: data.description,
          level: data.level,
          category: data.category,
          duration: duration,
          duration_type: data.durationType,
          image: data.image,
          status: 'Active',
          instructor_ids: Array.isArray(data.instructors) ? data.instructors : []
        })
        .eq('id', course.id);
        
      if (courseError) {
        console.error('Error updating course:', courseError);
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
    } finally {
      setIsLoading(false);
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
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-music-500"></div>
            </div>
          ) : (
            <CourseForm 
              form={form} 
              onSubmit={handleUpdateCourse} 
              teachers={teachers}
              skills={skills}
              submitButtonText="Update Course"
              cancelAction={() => onOpenChange(false)}
            />
          )}
          
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
              disabled={isLoading}
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
