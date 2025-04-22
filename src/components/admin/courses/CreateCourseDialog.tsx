
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
import { useAuth } from '@/hooks/useAuth';

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

const CreateCourseDialog: React.FC<CreateCourseDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { toast } = useToast();
  const { teachers = [] } = useTeachers();
  const { skills = [] } = useSkills();
  const { user } = useAuth();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      instructors: [],
      level: 'For Anyone',
      skill: '',
      durationValue: '0',
      durationMetric: 'weeks',
      durationType: 'fixed',
      image: '',
      classesCount: '0',
      classesDuration: '0',
      studioSessionsCount: '0',
      studioSessionsDuration: '0',
      practicalSessionsCount: '0',
      practicalSessionsDuration: '0',
    }
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        title: '',
        description: '',
        instructors: [],
        level: 'For Anyone',
        skill: '',
        durationValue: '0',
        durationMetric: 'weeks',
        durationType: 'fixed',
        image: '',
        classesCount: '0',
        classesDuration: '0',
        studioSessionsCount: '0',
        studioSessionsDuration: '0',
        practicalSessionsCount: '0',
        practicalSessionsDuration: '0',
      });
    }
  }, [open, form]);

  const handleCreateCourse = async (data: CourseFormValues) => {
    try {
      console.log('Creating course with data:', data);
      
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
            skill: data.skill,
            duration: duration,
            duration_type: data.durationType,
            image: data.image,
            students: 0,
            instructor_ids: Array.isArray(data.instructors) ? data.instructors : [],
            student_ids: [],
            classes_count: data.classesCount ? parseInt(data.classesCount) : 0,
            classes_duration: data.classesDuration ? parseInt(data.classesDuration) : 0,
            studio_sessions_count: data.studioSessionsCount ? parseInt(data.studioSessionsCount) : 0,
            studio_sessions_duration: data.studioSessionsDuration ? parseInt(data.studioSessionsDuration) : 0,
            practical_sessions_count: data.practicalSessionsCount ? parseInt(data.practicalSessionsCount) : 0,
            practical_sessions_duration: data.practicalSessionsDuration ? parseInt(data.practicalSessionsDuration) : 0
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;
