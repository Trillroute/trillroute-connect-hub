
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { enrollStudentInCourse } from '@/utils/enrollmentUtils';

/**
 * Hook to verify payment and handle enrollment after Razorpay checkout
 */
export const usePaymentVerification = (
  courseId: string,
  userId: string | undefined,
  isEnrolled: boolean,
  setEnrollmentProcessing: (value: boolean) => void,
  onEnrollmentSuccess: () => void
) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      // Get enrollment status from URL parameters
      const enrollmentStatus = searchParams.get('enrollment');
      const paymentStatus = searchParams.get('payment');
      
      console.log('Payment verification checking state:', {
        enrollmentStatus,
        paymentStatus,
        isEnrolled,
        isProcessing,
        userId,
        courseId,
        url: window.location.href
      });
      
      // Only proceed if we have a success parameter, user is not enrolled, and we're not already processing
      if (enrollmentStatus === 'success' && !isEnrolled && !isProcessing && userId && courseId) {
        console.log('Payment success detected from URL, processing enrollment');
        setIsProcessing(true);
        setEnrollmentProcessing(true);
        
        try {
          // Get payment data from session storage
          const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
          console.log('Payment data from session:', paymentDataStr);
          
          if (paymentDataStr) {
            const paymentData = JSON.parse(paymentDataStr);
            console.log('Parsed payment data:', paymentData);
            
            // Verify payment data matches current user and course
            if (paymentData.courseId === courseId && paymentData.userId === userId) {
              console.log('Valid payment data found, proceeding with enrollment');
              
              // Process enrollment
              const success = await enrollStudentInCourse(courseId, userId);
              
              if (success) {
                console.log('Enrollment successful');
                onEnrollmentSuccess();
                toast.success('Enrollment Successful', {
                  description: 'You are now enrolled in the course'
                });
                
                // Mark payment as processed in session storage
                paymentData.processed = true;
                sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(paymentData));
                
                // Remove enrollment parameter from URL
                navigate(`/courses/${courseId}`, { replace: true });
              } else {
                console.error('Enrollment failed after payment verification');
                toast.error('Enrollment Failed', {
                  description: 'Please contact support for assistance'
                });
              }
            } else {
              console.error('Payment data mismatch:', {
                paymentData,
                courseId,
                userId
              });
              toast.error('Payment Verification Failed', {
                description: 'Payment data does not match this course or user'
              });
            }
          } else {
            console.log('No payment data found in session storage');
            toast.error('Payment Information Missing', {
              description: 'Please try enrolling again or contact support'
            });
          }
        } catch (error) {
          console.error('Error processing payment verification:', error);
          toast.error('Payment Verification Error', {
            description: 'There was an error processing your payment verification'
          });
        } finally {
          setIsProcessing(false);
          setEnrollmentProcessing(false);
        }
      }
    };

    // Execute verification when component mounts or URL parameters change
    verifyPayment();
  }, [searchParams, isEnrolled, isProcessing, userId, courseId, navigate, onEnrollmentSuccess, setEnrollmentProcessing]);
};
