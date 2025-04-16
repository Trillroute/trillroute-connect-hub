
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
  classesCount: z.string().min(1, { message: "Number of classes is required" }),
  classesDuration: z.string().min(1, { message: "Class duration is required" }),
  studioSessionsCount: z.string().min(1, { message: "Number of studio sessions is required" }),
  studioSessionsDuration: z.string().min(1, { message: "Studio session duration is required" }),
  practicalSessionsCount: z.string().min(1, { message: "Number of practical sessions is required" }),
  practicalSessionsDuration: z.string().min(1, { message: "Practical session duration is required" }),
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
  const { user } = useAuth();
  
  // Fix the permission check by explicitly handling superadmin role
  const hasEditPermission = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'edit'));
  
  useEffect(() => {
    if (open && !hasEditPermission) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit courses.",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  }, [open, hasEditPermission, onOpenChange, toast]);

  const instructorIds = Array.isArray(course.instructor_ids) ? course.instructor_ids : [];

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
      durationType: course.duration_type || 'fixed',
      image: course.image,
      classesCount: course.classes_count?.toString() || '0',
      classesDuration: course.classes_duration?.toString() || '0',
      studioSessionsCount: course.studio_sessions_count?.toString() || '0',
      studioSessionsDuration: course.studio_sessions_duration?.toString() || '0',
      practicalSessionsCount: course.practical_sessions_count?.toString() || '0',
      practicalSessionsDuration: course.practical_sessions_duration?.toString() || '0',
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: course.title,
        description: course.description,
        instructors: instructorIds,
        level: course.level,
        skill: course.skill,
        durationValue: durationValue,
        durationMetric: durationMetric,
        durationType: course.duration_type || 'fixed',
        image: course.image,
        classesCount: course.classes_count?.toString() || '0',
        classesDuration: course.classes_duration?.toString() || '0',
        studioSessionsCount: course.studio_sessions_count?.toString() || '0',
        studioSessionsDuration: course.studio_sessions_duration?.toString() || '0',
        practicalSessionsCount: course.practical_sessions_count?.toString() || '0',
        practicalSessionsDuration: course.practical_sessions_duration?.toString() || '0',
      });
    }
  }, [course, form, open, instructorIds]);

  const handleUpdateCourse = async (data: CourseFormValues) => {
    if (!hasEditPermission) {
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
          classes_count: data.classesCount ? parseInt(data.classesCount) : 0,
          classes_duration: data.classesDuration ? parseInt(data.classesDuration) : 0,
          studio_sessions_count: data.studioSessionsCount ? parseInt(data.studioSessionsCount) : 0,
          studio_sessions_duration: data.studioSessionsDuration ? parseInt(data.studioSessionsDuration) : 0,
          practical_sessions_count: data.practicalSessionsCount ? parseInt(data.practicalSessionsCount) : 0,
          practical_sessions_duration: data.practicalSessionsDuration ? parseInt(data.practicalSessionsDuration) : 0
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
            disabled={isLoading || !hasEditPermission}
          >
            Update Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
