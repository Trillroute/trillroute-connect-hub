
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { fetchEventsBySingleValue } from '@/services/events/api/queries/filter/fetchEventsBySingleValue';

export function useCourseEnrollment() {
  const [loading, setLoading] = useState(false);

  // Check if student has completed a trial for the specific course
  const hasCompletedTrialForCourse = async (studentId: string, courseId: string): Promise<boolean> => {
    try {
      // Fetch all trial booking events
      const trialEvents = await fetchEventsBySingleValue('event_type', 'trial_booking');
      
      // Find trials for this specific student and course
      const studentTrialForCourse = trialEvents.find(event => {
        const metadata = event.metadata;
        if (typeof metadata === 'object' && metadata !== null) {
          const typedMetadata = metadata as any;
          return typedMetadata.student_id === studentId && typedMetadata.course_id === courseId;
        }
        return false;
      });

      return !!studentTrialForCourse;
    } catch (error) {
      console.error('Error checking trial completion:', error);
      return false;
    }
  };

  // Add a student to a course
  const addStudentToCourse = async (
    courseId: string, 
    studentId: string,
    teacherId?: string,
    additionalMetadata?: Record<string, any>
  ) => {
    if (!courseId || !studentId) return false;
    
    setLoading(true);
    try {
      // CRITICAL CHECK: Verify student has completed trial for this specific course
      const hasTrialCompleted = await hasCompletedTrialForCourse(studentId, courseId);
      
      if (!hasTrialCompleted) {
        toast.error('Student must complete a trial class for this course before enrollment');
        console.error('Enrollment blocked: Student has not completed trial for course', { studentId, courseId });
        setLoading(false);
        return false;
      }

      // First, get the current course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('student_ids, instructor_ids, title, course_type, duration_type')
        .eq('id', courseId)
        .single();
      
      if (courseError) {
        console.error('Error fetching course data:', courseError);
        toast.error('Failed to fetch course data');
        setLoading(false);
        return false;
      }
      
      // Check if student is already enrolled
      const studentIds = Array.isArray(courseData.student_ids) ? courseData.student_ids : [];
      if (studentIds.includes(studentId)) {
        toast.info('Student is already enrolled in this course');
        setLoading(false);
        return true;
      }
      
      // Add the student to the course
      const updatedStudentIds = [...studentIds, studentId];
      
      // Create the update object
      const updateObj = {
        student_ids: updatedStudentIds,
        students: updatedStudentIds.length
      };
      
      // If this is a solo/duo course with a teacher, create an enrollment record
      const isSoloOrDuo = courseData.course_type === 'solo' || courseData.course_type === 'duo';
      const isRecurring = courseData.duration_type === 'recurring';
      
      if (isSoloOrDuo && isRecurring && teacherId) {
        // Create an enrollment record with metadata including the teacher assignment
        // and any additional metadata like availability slot information
        const metadata = {
          courseId,
          teacherId,
          courseTitle: courseData.title,
          courseType: courseData.course_type,
          enrollmentDate: new Date().toISOString(),
          trialCompleted: true, // Mark that trial was verified
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
      }
      
      // Update the course with the new student
      const { error: updateError } = await supabase
        .from('courses')
        .update(updateObj)
        .eq('id', courseId);
      
      if (updateError) {
        console.error('Error updating course:', updateError);
        toast.error('Failed to update course');
        setLoading(false);
        return false;
      }
      
      console.log('Student successfully enrolled after trial verification', { studentId, courseId });
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('An error occurred during enrollment');
      setLoading(false);
      return false;
    }
  };

  // Generate a payment link for a course
  const generatePaymentLink = async (courseId: string, studentId: string, amount: number) => {
    if (!courseId || !studentId || amount <= 0) return null;
    
    try {
      // CRITICAL CHECK: Verify student has completed trial for this specific course before generating payment link
      const hasTrialCompleted = await hasCompletedTrialForCourse(studentId, courseId);
      
      if (!hasTrialCompleted) {
        console.error('Payment link generation blocked: Student has not completed trial for course', { studentId, courseId });
        toast.error('Student must complete a trial class for this course before payment');
        return null;
      }

      // Generate a unique order ID
      const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Store order information in the database
      const { error } = await supabase
        .from('orders')
        .insert({
          order_id: orderId,
          user_id: studentId,
          course_id: courseId,
          amount,
          status: 'pending',
          metadata: {
            generated_at: new Date().toISOString(),
            payment_type: 'course_enrollment',
            trial_completed: true // Mark that trial was verified
          }
        });
      
      if (error) {
        console.error('Error creating order:', error);
        return null;
      }
      
      // Generate a payment link (in a real app, this would involve your payment provider)
      // This is a placeholder that would normally call your payment gateway API
      const baseUrl = window.location.origin;
      const paymentLink = `${baseUrl}/payment?order=${orderId}&course=${courseId}&student=${studentId}&amount=${amount}`;
      
      console.log('Payment link generated after trial verification', { studentId, courseId, orderId });
      return paymentLink;
    } catch (error) {
      console.error('Error generating payment link:', error);
      return null;
    }
  };

  return {
    addStudentToCourse,
    generatePaymentLink,
    loading,
    hasCompletedTrialForCourse
  };
}
