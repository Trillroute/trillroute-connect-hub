
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useStudentEnrollment } from './useStudentEnrollment';

export function usePaymentLink() {
  const { addStudentToCourse } = useStudentEnrollment();

  // Generate a payment link for a course (or handle free enrollment)
  const generatePaymentLink = async (courseId: string, studentId: string, amount: number) => {
    if (!courseId || !studentId) return null;
    
    try {
      console.log('Generating payment link for:', { courseId, studentId, amount });

      // Handle free courses (amount = 0)
      if (amount === 0) {
        console.log('Free course detected, enrolling student directly');
        
        // For free courses, enroll the student directly without payment
        const enrollmentSuccess = await addStudentToCourse(courseId, studentId);
        
        if (enrollmentSuccess) {
          console.log('Free course enrollment successful');
          return 'FREE_ENROLLMENT_SUCCESS'; // Special return value for free courses
        } else {
          console.error('Free course enrollment failed');
          toast.error('Failed to enroll in free course');
          return null;
        }
      }

      // For paid courses, generate payment link
      const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      console.log('Creating order with ID:', orderId);
      
      // Store order information in the database
      const { data: orderData, error } = await supabase
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
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating order:', error);
        toast.error('Failed to create payment order');
        return null;
      }
      
      console.log('Order created successfully:', orderData);
      
      // Generate the correct payment link format that matches the route structure
      const baseUrl = window.location.origin;
      const paymentLink = `${baseUrl}/payment/${courseId}?order_id=${orderId}&student_id=${studentId}&amount=${amount}`;
      
      console.log('Payment link generated successfully:', paymentLink);
      console.log('Payment link generated after trial verification', { studentId, courseId, orderId });
      
      return paymentLink;
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Failed to generate payment link');
      return null;
    }
  };

  return {
    generatePaymentLink
  };
}
