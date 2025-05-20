
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createRazorpayOrder } from '@/utils/razorpayConfig';

export function useCourseEnrollment() {
  const [loading, setLoading] = useState(false);

  /**
   * Generate a Razorpay payment link for fixed courses
   */
  const generatePaymentLink = async (courseId: string, studentId: string, amount: number): Promise<string | null> => {
    try {
      console.log('Generating payment link for:', { courseId, studentId, amount });
      
      // Create Razorpay order
      const orderData = await createRazorpayOrder(amount, courseId, studentId);
      
      console.log('Order data received:', orderData);
      
      if (!orderData || !orderData.orderId) {
        console.error('Failed to create payment order, orderData:', orderData);
        toast.error('Failed to generate payment link');
        throw new Error('Failed to create payment order');
      }

      // Generate a payment link that can be shared
      const paymentLink = `${window.location.origin}/payment/${courseId}?order_id=${orderData.orderId}&student_id=${studentId}`;
      console.log('Generated payment link:', paymentLink);
      return paymentLink;
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Failed to generate payment link');
      return null;
    }
  };

  /**
   * Send payment link via email
   */
  const sendPaymentEmail = async (studentId: string, courseId: string, paymentLink: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('send-payment-email', {
        body: {
          studentId,
          courseId,
          paymentLink
        }
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error sending payment email:', error);
      return false;
    }
  };

  /**
   * Add a student to a course
   */
  const addStudentToCourse = async (courseId: string, studentId: string, teacherId?: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Get current course data to check its type (fixed or recurring)
      const { data: courseData, error: fetchError } = await supabase
        .from('courses')
        .select('student_ids, students, duration_type, final_price')
        .eq('id', courseId)
        .single();

      if (fetchError) {
        console.error('Error fetching course:', fetchError);
        toast.error('Failed to add student to course');
        return false;
      }

      const currentStudentIds = courseData.student_ids || [];
      
      // Check if student is already enrolled
      if (currentStudentIds.includes(studentId)) {
        toast.info('Student is already enrolled in this course');
        return true;
      }

      // Check if this is a fixed course
      const isFixedCourse = courseData.duration_type === 'fixed';
      
      if (isFixedCourse) {
        // For fixed courses, generate a payment link and send via email
        const amount = courseData.final_price || 0;
        
        // Generate payment link
        const paymentLink = await generatePaymentLink(courseId, studentId, amount);
        
        if (!paymentLink) {
          toast.error('Failed to generate payment link');
          return false;
        }
        
        // Send payment link via email
        const emailSent = await sendPaymentEmail(studentId, courseId, paymentLink);
        
        if (emailSent) {
          toast.success('Payment link sent to student email');
          
          // For fixed courses, we don't enroll immediately - enrollment happens after payment
          return true;
        } else {
          toast.error('Failed to send payment link to student');
          return false;
        }
      } else {
        // For recurring courses, proceed with direct enrollment
        // Prepare enrollment metadata
        const enrollmentMetadata = {
          enrolled_at: new Date().toISOString(),
          enrolled_by: 'admin'
        };
        
        // If teacher is specified, add to metadata
        if (teacherId) {
          enrollmentMetadata['assigned_teacher_id'] = teacherId;
        }

        // Add student to course
        const newStudentIds = [...currentStudentIds, studentId];
        const newStudentCount = (courseData.students || 0) + 1;

        const { error: updateError } = await supabase
          .from('courses')
          .update({
            student_ids: newStudentIds,
            students: newStudentCount,
          })
          .eq('id', courseId);

        if (updateError) {
          console.error('Error updating course:', updateError);
          toast.error('Failed to add student to course');
          return false;
        }

        toast.success('Student added to course successfully');
        return true;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove a student from a course
   */
  const removeStudentFromCourse = async (courseId: string, studentId: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Get current course data
      const { data: courseData, error: fetchError } = await supabase
        .from('courses')
        .select('student_ids, students')
        .eq('id', courseId)
        .single();

      if (fetchError) {
        console.error('Error fetching course:', fetchError);
        toast.error('Failed to remove student from course');
        return false;
      }

      const currentStudentIds = courseData.student_ids || [];
      
      // Check if student is enrolled
      if (!currentStudentIds.includes(studentId)) {
        toast.info('Student is not enrolled in this course');
        return true;
      }

      // Remove student from course
      const newStudentIds = currentStudentIds.filter(id => id !== studentId);
      const newStudentCount = Math.max((courseData.students || 0) - 1, 0);

      const { error: updateError } = await supabase
        .from('courses')
        .update({
          student_ids: newStudentIds,
          students: newStudentCount
        })
        .eq('id', courseId);

      if (updateError) {
        console.error('Error updating course:', updateError);
        toast.error('Failed to remove student from course');
        return false;
      }

      toast.success('Student removed from course successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update course instructors
   */
  const updateCourseInstructors = async (courseId: string, instructorIds: string[]): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          instructor_ids: instructorIds
        })
        .eq('id', courseId);

      if (error) {
        console.error('Error updating course instructors:', error);
        toast.error('Failed to update course instructors');
        return false;
      }

      toast.success('Course instructors updated successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addStudentToCourse,
    removeStudentFromCourse,
    updateCourseInstructors,
    generatePaymentLink,
    sendPaymentEmail
  };
}
