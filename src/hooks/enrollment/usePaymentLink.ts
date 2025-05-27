
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

      // For paid courses, generate payment link and send email
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
      
      // Generate the payment link
      const baseUrl = window.location.origin;
      const paymentLink = `${baseUrl}/payment/${courseId}?order_id=${orderId}&student_id=${studentId}&amount=${amount}`;
      
      console.log('Payment link generated:', paymentLink);
      
      // Send email with payment link
      try {
        const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-payment-email', {
          body: {
            studentId,
            courseId,
            paymentLink
          }
        });

        if (emailError) {
          console.error('Error sending payment email:', emailError);
          toast.error('Failed to send payment email. Please contact support.');
        } else {
          console.log('Payment email sent successfully:', emailResult);
          toast.success('Payment link sent to your email!', {
            description: 'Please check your email for the payment link.',
          });
        }
      } catch (emailError) {
        console.error('Error invoking email function:', emailError);
        toast.error('Failed to send payment email. Please contact support.');
      }
      
      // Also show the payment link in a toast for immediate access
      toast.success('Payment link generated!', {
        description: `Payment link: ${paymentLink}`,
        duration: 10000, // Show for 10 seconds
        action: {
          label: "Copy Link",
          onClick: () => {
            navigator.clipboard.writeText(paymentLink);
            toast.success('Payment link copied to clipboard!');
          }
        }
      });
      
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
