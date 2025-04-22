import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Course, DurationMetric } from '@/types/course';
import { useTeachers } from '@/hooks/useTeachers';
import { useSkills } from '@/hooks/useSkills';
import CourseForm, { CourseFormValues } from './CourseForm';
import { useAuth } from '@/hooks/useAuth';
import { canManageCourses } from '@/utils/adminPermissions';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  skill: z.string().min(1, { message: "Skill is required" }),
  durationType: z.enum(["fixed", "recurring"]),
  durationValue: z.string().optional(),
  durationMetric: z.enum(["days", "weeks", "months", "years"]).optional(),
  image: z.string().url({ message: "Must be a valid URL" }),
}).refine((data) => {
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
  const { user, isSuperAdmin } = useAuth();
  
  // Determine if user has edit permissions
  const hasEditPermission = isSuperAdmin() || 
    (user?.role === 'admin' && canManageCourses(user, 'edit'));
  
  console.log('EditCourseDialog - User:', user);
  console.log('EditCourseDialog - User role:', user?.role);
  console.log('EditCourseDialog - Is superadmin?', isSuperAdmin());
  console.log('EditCourseDialog - hasEditPermission:', hasEditPermission);
  console.log('EditCourseDialog - admin role name:', user?.adminRoleName);
  
  // Debug logs for admin users
  if (user && user.role === 'admin') {
    console.log('EditCourseDialog - Can manage courses check:', canManageCourses(user, 'edit'));
  }

  useEffect(() => {
    if (open && !hasEditPermission) {
      console.log('EditCourseDialog - Permission denied, closing dialog');
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit courses.",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  }, [open, hasEditPermission, onOpenChange, toast]);

  // Ensure we have arrays for instructors and students
  const instructorIds = Array.isArray(course.instructor_ids) ? course.instructor_ids : [];
  // Keep track of student_ids for database operations but don't expose to the form
  const studentIds = Array.isArray(course.student_ids) ? course.student_ids : [];

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
  
  const { value: durationValue, metric: durationMetric } = parseDuration(
    course.duration, 
    course.duration_type
  );

  // Convert the duration_type to the proper literal type
  const durationType: "fixed" | "recurring" = 
    (course.duration_type === "fixed" || course.duration_type === "recurring") 
      ? course.duration_type as "fixed" | "recurring" 
      : "fixed";

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      instructors: instructorIds,
      level: course.level,
      skill: course.skill,
      durationValue: durationValue,
      durationMetric: durationMetric,
      durationType: durationType,
      image: course.image,
    }
  });

  // This will ensure the form values are correctly reset every time the dialog opens
  // or whenever the course object changes
  useEffect(() => {
    if (open) {
      console.log('EditCourseDialog - Form resetting with course:', course);
      console.log('EditCourseDialog - Reset instructor_ids:', instructorIds);
      
      // Force reset the form every time the dialog opens to ensure latest data
      form.reset({
        title: course.title,
        description: course.description,
        instructors: [...instructorIds], // Create new array to ensure reactivity
        level: course.level,
        skill: course.skill,
        durationValue: durationValue,
        durationMetric: durationMetric,
        durationType: durationType,
        image: course.image,
      });
      
      console.log('EditCourseDialog - Form reset complete');
    }
  }, [course, open, instructorIds, durationValue, durationMetric, durationType, form]);

  // Monitor form values for debugging
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('EditCourseDialog - Form values updated:', value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleUpdateCourse = async (data: CourseFormValues) => {
    if (!hasEditPermission) {
      console.log('EditCourseDialog - Update attempt without permission');
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit courses.",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      let duration = '';
      if (data.durationType === 'fixed' && data.durationValue && data.durationMetric) {
        duration = `${data.durationValue} ${data.durationMetric}`;
      } else {
        duration = 'Recurring';
      }
      
      // Debug logs before update
      console.log('Updating course with instructors:', data.instructors);
      
      const { error: courseError } = await supabase
        .from('courses')
        .update({
          title: data.title,
          description: data.description,
          level: data.level,
          skill: data.skill,
          duration: duration,
          duration_type: data.durationType,
          image: data.image,
          instructor_ids: Array.isArray(data.instructors) ? data.instructors : [],
          student_ids: studentIds, // Keep existing student_ids
          students: studentIds.length, // Update the student count to match the array length
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
    <Dialog open={open && hasEditPermission} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
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
          <ScrollArea className="max-h-[calc(100vh-14rem)] pr-4">
            <CourseForm 
              form={form} 
              onSubmit={handleUpdateCourse} 
              teachers={teachers}
              skills={skills}
              submitButtonText="Update Course"
              cancelAction={() => onOpenChange(false)}
            />
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
