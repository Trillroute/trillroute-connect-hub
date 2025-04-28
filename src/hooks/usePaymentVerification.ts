
import { useEffect } from 'react';
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

  useEffect(() => {
    const verifyPayment = async () => {
      const enrollmentStatus = searchParams.get('enrollment');
      
      if (enrollmentStatus === 'success' && !isEnrolled && !enrollmentProcessing && userId && courseId) {
        console.log('Payment success detected from URL, processing enrollment');
        setEnrollmentProcessing(true);
        
        const paymentIntentString = sessionStorage.getItem('paymentIntent');
        if (paymentIntentString) {
          try {
            const paymentIntent = JSON.parse(paymentIntentString);
            
            if (paymentIntent.courseId === courseId && paymentIntent.userId === userId && paymentIntent.completed) {
              console.log('Valid payment intent found, proceeding with enrollment');
              
              const success = await enrollStudentInCourse(courseId, userId);
              if (success) {
                onEnrollmentSuccess();
                toast.success('Enrollment Successful', {
                  description: 'You are now enrolled in the course'
                });
                
                paymentIntent.handled = true;
                sessionStorage.setItem('paymentIntent', JSON.stringify(paymentIntent));
                navigate(`/courses/${courseId}`, { replace: true });
              } else {
                toast.error('Enrollment Failed', {
                  description: 'Please contact support for assistance'
                });
              }
            } else {
              console.error('Payment intent mismatch or not completed');
            }
          } catch (error) {
            console.error('Error parsing payment intent:', error);
            toast.error('Payment Data Error', {
              description: 'There was an error processing your payment data'
            });
          }
        } else {
          console.log('No payment intent found in session storage');
          toast.error('Payment Information Missing', {
            description: 'Payment information was lost. Please try again or contact support.'
          });
        }
        setEnrollmentProcessing(false);
      }
    };

    verifyPayment();
  }, [searchParams, isEnrolled, enrollmentProcessing, userId, courseId, setEnrollmentProcessing, navigate, onEnrollmentSuccess]);
};

