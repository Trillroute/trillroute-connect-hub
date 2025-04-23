
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CourseFormValues } from './CourseForm';
import { useTeachers } from '@/hooks/useTeachers';
import { useSkills } from '@/hooks/useSkills';
import CourseForm from './CourseForm';
import { useAuth } from '@/hooks/useAuth';
import { canManageCourses } from '@/utils/adminPermissions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader } from 'lucide-react';
import { ClassTypeData } from '@/types/course';

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  level: z.string().min(1, { message: "Level is required" }),
  skill: z.string().min(1, { message: "Skill is required" }),
  durationType: z.enum(["fixed", "recurring"]),
  durationValue: z.string().optional(),
  durationMetric: z.enum(["days", "weeks", "months", "years"]).optional(),
  image: z.string().url({ message: "Must be a valid URL" }),
  instructors: z.array(z.string()).min(1, { message: "At least one instructor is required" }),
  class_types_data: z.array(z.object({
    class_type_id: z.string(),
    quantity: z.number()
  })).optional(),
}).refine((data) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const { user, isSuperAdmin } = useAuth();

  const hasAddPermission = isSuperAdmin() ||
    (user?.role === 'admin' && canManageCourses(user, 'add'));

  useEffect(() => {
    if (open && !hasAddPermission) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add courses.",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  }, [open, hasAddPermission, onOpenChange, toast]);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      level: 'Beginner',
      skill: '',
      durationType: 'fixed',
      durationValue: '',
      durationMetric: 'weeks',
      image: '',
      instructors: [],
      class_types_data: [],
    }
  });

  const handleCreateCourse = async (data: CourseFormValues) => {
    if (!hasAddPermission) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add courses.",
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
      
      console.log('Creating course with instructors:', data.instructors);
      console.log('Creating course with class types:', data.class_types_data);
      
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: data.title,
          description: data.description,
          level: data.level,
          skill: data.skill,
          duration: duration,
          duration_type: data.durationType,
          image: data.image,
          instructor_ids: Array.isArray(data.instructors) ? data.instructors : [],
          students: 0,
          student_ids: [],
          // Convert ClassTypeData[] to Json for Supabase
          class_types_data: data.class_types_data || [] as any,
        })
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open && hasAddPermission} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-music-600">Create New Course</DialogTitle>
          <p className="text-muted-foreground mt-2">
            Fill in the course details below. All fields marked with * are required.
          </p>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-music-500" />
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(100vh-8rem)]">
            <div className="p-6 pt-2">
              <CourseForm 
                form={form} 
                onSubmit={handleCreateCourse} 
                teachers={teachers}
                skills={skills}
                submitButtonText="Create Course"
                cancelAction={() => onOpenChange(false)}
              />
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;
