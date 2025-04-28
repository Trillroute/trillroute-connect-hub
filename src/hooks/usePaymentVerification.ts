
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { enrollStudentInCourse } from '@/utils/enrollmentUtils';

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
      console.log('Payment verification checking params:', {
        enrollmentStatus: searchParams.get('enrollment'),
        isEnrolled,
        isProcessing,
        userId,
        courseId
      });
      
      const enrollmentStatus = searchParams.get('enrollment');
      
      if (enrollmentStatus === 'success' && !isEnrolled && !isProcessing && userId && courseId) {
        console.log('Payment success detected from URL, processing enrollment');
        setIsProcessing(true);
        setEnrollmentProcessing(true);
        
        try {
          const paymentIntentString = sessionStorage.getItem('paymentIntent');
          console.log('Payment intent from session:', paymentIntentString);
          
          if (paymentIntentString) {
            const paymentIntent = JSON.parse(paymentIntentString);
            
            if (paymentIntent.courseId === courseId && paymentIntent.userId === userId && paymentIntent.completed) {
              console.log('Valid payment intent found, proceeding with enrollment');
              
              const success = await enrollStudentInCourse(courseId, userId);
              if (success) {
                console.log('Enrollment successful, triggering success callback');
                onEnrollmentSuccess();
                toast.success('Enrollment Successful', {
                  description: 'You are now enrolled in the course'
                });
                
                paymentIntent.handled = true;
                sessionStorage.setItem('paymentIntent', JSON.stringify(paymentIntent));
                navigate(`/courses/${courseId}`, { replace: true });
              } else {
                console.error('Enrollment failed after payment');
                toast.error('Enrollment Failed', {
                  description: 'Please contact support for assistance'
                });
              }
            } else {
              console.error('Payment intent mismatch or not completed', {
                paymentIntent,
                courseId,
                userId
              });
            }
          } else {
            console.log('No payment intent found in session storage');
            toast.error('Payment Information Missing', {
              description: 'Payment information was lost. Please try again or contact support.'
            });
          }
        } catch (error) {
          console.error('Error processing payment verification:', error);
          toast.error('Payment Data Error', {
            description: 'There was an error processing your payment data'
          });
        } finally {
          setIsProcessing(false);
          setEnrollmentProcessing(false);
        }
      }
    };

    verifyPayment();
  }, [searchParams, isEnrolled, isProcessing, userId, courseId, setEnrollmentProcessing, navigate, onEnrollmentSuccess]);
};
