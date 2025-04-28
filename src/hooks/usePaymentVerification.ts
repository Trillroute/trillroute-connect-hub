
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { enrollStudentInCourse } from '@/utils/enrollmentUtils';
import { checkPaymentProcessed } from '@/utils/orderUtils';

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
            
            // Check if payment has been processed in the database as a backup verification
            const isPaymentProcessed = await checkPaymentProcessed(courseId, userId);
            console.log('Payment processed status from database:', isPaymentProcessed);
            
            // Verify payment data matches current user and course
            const isValidPaymentData = paymentData.courseId === courseId && 
                                       paymentData.userId === userId &&
                                       paymentData.completed === true;
                                       
            console.log('Is valid payment data:', isValidPaymentData);
            
            // Process enrollment if payment data is valid or payment is already processed in DB
            if (isValidPaymentData || isPaymentProcessed || paymentStatus === 'verified') {
              console.log('Valid payment verification found, proceeding with enrollment');
              
              // Process enrollment
              const success = await enrollStudentInCourse(courseId, userId);
              
              if (success) {
                console.log('Enrollment successful');
                onEnrollmentSuccess();
                toast.success('Enrollment Successful', {
                  description: 'You are now enrolled in the course'
                });
                
                // Mark payment as processed in session storage
                if (paymentDataStr) {
                  const updatedPaymentData = {
                    ...paymentData,
                    processed: true,
                    enrollmentCompleted: true,
                    enrollmentTime: Date.now()
                  };
                  sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(updatedPaymentData));
                  console.log('Payment data updated with enrollment success:', updatedPaymentData);
                }
                
                // Remove enrollment parameter from URL
                navigate(`/courses/${courseId}`, { replace: true });
              } else {
                console.error('Enrollment failed after payment verification');
                toast.error('Enrollment Failed', {
                  description: 'Please contact support for assistance'
                });
              }
            } else {
              console.error('Payment data validation failed:', {
                paymentData,
                courseId,
                userId
              });
              toast.error('Payment Verification Failed', {
                description: 'Please try refreshing the page or contact support'
              });
            }
          } else {
            console.log('No payment data found in session storage');
            
            // Check if payment is already processed in database as fallback
            const isPaymentProcessed = await checkPaymentProcessed(courseId, userId);
            console.log('Fallback payment check from database:', isPaymentProcessed);
            
            if (isPaymentProcessed || paymentStatus === 'verified') {
              console.log('Payment verified through database, proceeding with enrollment');
              const success = await enrollStudentInCourse(courseId, userId);
              
              if (success) {
                console.log('Enrollment successful via database verification');
                onEnrollmentSuccess();
                toast.success('Enrollment Successful', {
                  description: 'You are now enrolled in the course'
                });
                navigate(`/courses/${courseId}`, { replace: true });
              } else {
                toast.error('Enrollment Failed', {
                  description: 'Please contact support for assistance'
                });
              }
            } else {
              toast.error('Payment Information Missing', {
                description: 'Please try enrolling again or contact support'
              });
            }
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
