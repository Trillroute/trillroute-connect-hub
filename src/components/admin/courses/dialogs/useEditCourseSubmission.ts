
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/types/course';
import { CourseFormValues } from '../CourseForm';

export function useEditCourseSubmission(
  course: Course,
  onSuccess: () => void,
  onClose: () => void,
  hasEditPermission: boolean
) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateCourse = async (data: CourseFormValues) => {
    if (!hasEditPermission) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit courses.",
        variant: "destructive",
      });
      onClose();
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
      
      console.log('Updating course with instructors:', data.instructors);
      console.log('Updating course with class types:', data.class_types_data);

      const studentIds = Array.isArray(course.student_ids) ? course.student_ids : [];

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
          student_ids: studentIds,
          students: studentIds.length,
          class_types_data: data.class_types_data || [] as any,
          course_type: data.course_type,
          base_price: data.base_price,
          is_gst_applicable: data.is_gst_applicable,
          gst_rate: data.gst_rate,
          discount_metric: data.discount_metric,
          discount_value: data.discount_value,
          discount_validity: data.discount_validity,
          discount_code: data.discount_code
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
      
      onClose();
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

  return {
    isLoading,
    handleUpdateCourse
  };
}
