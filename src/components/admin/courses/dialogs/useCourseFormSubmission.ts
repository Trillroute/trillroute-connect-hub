
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { courseSchema, CourseFormSchemaType } from './CourseFormSchema';
import { CourseFormValues } from '../CourseForm';

export const useCourseFormSubmission = (
  onSuccess: () => void, 
  onOpenChange: (open: boolean) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      base_price: 0,
      is_gst_applicable: false,
      gst_rate: 0,
      discount_metric: 'percentage',
      discount_value: 0,
      discount_validity: '',
      discount_code: '',
      course_type: 'group',
    }
  });

  const handleCreateCourse = async (data: CourseFormValues) => {
    try {
      setIsLoading(true);
      
      let duration = '';
      if (data.durationType === 'fixed' && data.durationValue && data.durationMetric) {
        duration = `${data.durationValue} ${data.durationMetric}`;
      } else {
        duration = 'Recurring';
      }

      let finalPrice = data.base_price;
      if (data.is_gst_applicable && data.gst_rate) {
        finalPrice += (finalPrice * data.gst_rate) / 100;
      }
      
      if (data.discount_value && data.discount_value > 0) {
        if (data.discount_metric === 'percentage') {
          finalPrice -= (finalPrice * data.discount_value) / 100;
        } else {
          finalPrice -= data.discount_value;
        }
      }
      
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
          class_types_data: data.class_types_data ? data.class_types_data as any : [],
          base_price: data.base_price,
          is_gst_applicable: data.is_gst_applicable,
          gst_rate: data.is_gst_applicable ? data.gst_rate : 0,
          final_price: finalPrice,
          discount_metric: data.discount_metric,
          discount_value: data.discount_value || 0,
          discount_validity: data.discount_validity || null,
          discount_code: data.discount_code || null,
          course_type: data.course_type,
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

  return {
    form,
    isLoading,
    handleCreateCourse
  };
};
