
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { enrollStudentInCourse } from '@/utils/enrollment/enrollment/enrollmentOperations';
import { useCalendarEventCreation } from './useCalendarEventCreation';
import { cleanupDuplicateEvents } from '@/utils/enrollment/cleanupDuplicateEvents';
import { removeUsedAvailabilitySlot } from '@/utils/enrollment/cleanup/availabilitySlotCleanup';

export function useStudentEnrollment() {
  const [loading, setLoading] = useState(false);
  const { createRecurringEvents, createOneTimeEvents } = useCalendarEventCreation();

  const addStudentToCourse = async (
    courseId: string,
    studentId: string,
    teacherId?: string,
    additionalMetadata?: Record<string, any>
  ) => {
    if (!courseId || !studentId) return false;
    
    setLoading(true);
    try {
      console.log('Starting enrollment process:', { courseId, studentId, teacherId, additionalMetadata });
      
      // First clean up any existing duplicate events for this exact enrollment
      await cleanupDuplicateEvents(courseId, studentId, teacherId);
      
      // Enroll the student in the course
      const enrollmentSuccess = await enrollStudentInCourse(courseId, studentId);
      
      if (!enrollmentSuccess) {
        console.error('Failed to enroll student in course');
        setLoading(false);
        return false;
      }

      console.log('Student enrolled successfully, creating calendar events');

      // Get course details to determine if it's recurring or one-time
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('duration_type, course_type, title')
        .eq('id', courseId)
        .single();

      if (courseError) {
        console.error('Error fetching course details:', courseError);
        setLoading(false);
        return false;
      }

      let calendarSuccess = false;

      // Create calendar events based on course type
      if (course.duration_type === 'recurring' && course.course_type === 'solo') {
        // For recurring solo courses, we need a teacher and availability slot
        if (teacherId && additionalMetadata?.availabilitySlotId) {
          console.log('Creating recurring events for solo course with slot data:', additionalMetadata);
          
          // Remove the availability slot first since it's now booked
          await removeUsedAvailabilitySlot(additionalMetadata.availabilitySlotId);
          
          calendarSuccess = await createRecurringEvents(
            courseId,
            studentId,
            teacherId,
            additionalMetadata,
            course
          );
        } else {
          console.warn('Missing teacher or availability slot for recurring solo course');
          calendarSuccess = true; // Don't fail enrollment if calendar events fail
        }
      } else if (course.duration_type === 'recurring' && course.course_type === 'duo') {
        // For recurring duo courses
        if (teacherId && additionalMetadata?.availabilitySlotId) {
          console.log('Creating recurring events for duo course with slot data:', additionalMetadata);
          calendarSuccess = await createRecurringEvents(
            courseId,
            studentId,
            teacherId,
            additionalMetadata,
            course
          );
        } else {
          console.warn('Missing teacher or availability slot for recurring duo course');
          calendarSuccess = true;
        }
      } else {
        // For one-time courses or group courses
        console.log('Creating one-time events');
        calendarSuccess = await createOneTimeEvents(
          courseId,
          studentId,
          teacherId,
          course
        );
      }

      if (calendarSuccess) {
        console.log('Calendar events created successfully');
      } else {
        console.warn('Calendar events creation failed, but enrollment succeeded');
      }

      console.log('Student successfully enrolled after trial verification', { studentId, courseId });
      setLoading(false);
      return true;

    } catch (error) {
      console.error('Error in addStudentToCourse:', error);
      toast.error('An error occurred during enrollment');
      setLoading(false);
      return false;
    }
  };

  return {
    addStudentToCourse,
    loading
  };
}
