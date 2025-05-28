
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useCalendarEventCreation } from './useCalendarEventCreation';

export function useStudentEnrollment() {
  const { createRecurringEvents, createOneTimeEvents } = useCalendarEventCreation();

  // Add a student to a course
  const addStudentToCourse = async (
    courseId: string, 
    studentId: string,
    teacherId?: string,
    additionalMetadata?: Record<string, any>
  ) => {
    if (!courseId || !studentId) return false;
    
    try {
      console.log('Starting enrollment process for student:', studentId, 'course:', courseId);
      
      // First, get the current course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('student_ids, instructor_ids, title, course_type, duration_type')
        .eq('id', courseId)
        .single();
      
      if (courseError) {
        console.error('Error fetching course data:', courseError);
        toast.error('Failed to fetch course data');
        return false;
      }
      
      // Check if student is already enrolled
      const studentIds = Array.isArray(courseData.student_ids) ? courseData.student_ids : [];
      if (studentIds.includes(studentId)) {
        toast.info('Student is already enrolled in this course');
        return true;
      }
      
      // Add the student to the course
      const updatedStudentIds = [...studentIds, studentId];
      
      // Create the update object
      const updateObj = {
        student_ids: updatedStudentIds,
        students: updatedStudentIds.length
      };
      
      // Check course type and duration for calendar event creation
      const isSoloOrDuo = courseData.course_type === 'solo' || courseData.course_type === 'duo';
      const isRecurring = courseData.duration_type === 'recurring';
      const isGroup = courseData.course_type === 'group';
      
      // Create enrollment record with metadata
      const metadata = {
        courseId,
        teacherId,
        courseTitle: courseData.title,
        courseType: courseData.course_type,
        enrollmentDate: new Date().toISOString(),
        trialCompleted: true,
        ...(additionalMetadata || {})
      };
      
      // Insert the enrollment record
      const { error: enrollmentError } = await supabase
        .from('user_events')
        .insert({
          id: uuidv4(),
          user_id: studentId,
          event_type: 'enrollment',
          title: `Enrolled in ${courseData.title}`,
          description: `Enrolled with teacher ID: ${teacherId}`,
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          metadata
        });
        
      if (enrollmentError) {
        console.error('Error creating enrollment record:', enrollmentError);
        // Continue with the course update even if the enrollment record fails
      }
      
      // Update the course with the new student
      const { error: updateError } = await supabase
        .from('courses')
        .update(updateObj)
        .eq('id', courseId);
      
      if (updateError) {
        console.error('Error updating course:', updateError);
        toast.error('Failed to update course');
        return false;
      }
      
      // Create calendar events based on course type and teacher availability
      let calendarEventsCreated = false;
      
      if (isSoloOrDuo && isRecurring && teacherId && additionalMetadata?.availabilitySlotId) {
        // For solo/duo recurring courses with selected availability slot
        console.log('Creating recurring events for solo/duo course');
        calendarEventsCreated = await createRecurringEvents(
          courseId,
          studentId,
          teacherId,
          additionalMetadata,
          courseData
        );
      } else if (isGroup || !isRecurring) {
        // For group courses or one-time courses
        console.log('Creating one-time events for group/one-time course');
        calendarEventsCreated = await createOneTimeEvents(
          courseId,
          studentId,
          teacherId,
          courseData
        );
      }
      
      if (calendarEventsCreated) {
        console.log('Calendar events created successfully');
        toast.success('Student enrolled and calendar events created!');
      } else {
        console.log('Calendar events creation failed or skipped');
        toast.success('Student enrolled successfully (calendar events may need manual scheduling)');
      }
      
      console.log('Student successfully enrolled after trial verification', { studentId, courseId });
      return true;
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('An error occurred during enrollment');
      return false;
    }
  };

  return {
    addStudentToCourse
  };
}
