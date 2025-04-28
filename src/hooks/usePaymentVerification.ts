
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { enrollStudentInCourse, isStudentEnrolledInCourse, forceVerifyEnrollment } from '@/utils/enrollment';
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
      if ((enrollmentStatus === 'success' || paymentStatus === 'verified') && !isEnrolled && !isProcessing && userId && courseId) {
        console.log('Payment success detected, processing enrollment');
        setIsProcessing(true);
        setEnrollmentProcessing(true);
        
        try {
          // Always verify enrollment from database first
          const actuallyEnrolled = await forceVerifyEnrollment(courseId, userId);
          
          if (actuallyEnrolled) {
            console.log('User is already enrolled according to database check');
            onEnrollmentSuccess();
            toast.success('You are already enrolled in this course');
            navigate(`/courses/${courseId}`, { replace: true });
            setIsProcessing(false);
            setEnrollmentProcessing(false);
            return;
          }
          
          // First check if payment has been processed in the database
          const isPaymentProcessed = await checkPaymentProcessed(courseId, userId);
          console.log('Payment processed status from database:', isPaymentProcessed);
          
          if (isPaymentProcessed) {
            console.log('Payment verification confirmed via database, proceeding with enrollment');
            
            // Process enrollment
            const success = await enrollStudentInCourse(courseId, userId);
            
            if (success) {
              console.log('Enrollment successful');
              
              // Double verify enrollment was successful
              const enrollmentConfirmed = await forceVerifyEnrollment(courseId, userId);
              if (enrollmentConfirmed) {
                onEnrollmentSuccess();
                toast.success('Enrollment Successful', {
                  description: 'You are now enrolled in the course'
                });
              } else {
                toast.error('Enrollment Status Issue', {
                  description: 'There was an issue with your enrollment. Please refresh or contact support.'
                });
              }
              
              // Remove enrollment parameter from URL
              navigate(`/courses/${courseId}`, { replace: true });
            } else {
              // Don't show error if enrollment failed but payment succeeded
              console.error('Enrollment failed after payment verification');
              // Still remove the parameters from the URL to avoid repeated attempts
              navigate(`/courses/${courseId}`, { replace: true });
            }
          } else {
            // Check payment data in session storage as fallback
            const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
            
            if (paymentDataStr) {
              const paymentData = JSON.parse(paymentDataStr);
              console.log('Parsed payment data:', paymentData);
              
              // Verify payment data matches current user and course
              const isValidPaymentData = paymentData.courseId === courseId && 
                                       paymentData.userId === userId &&
                                       (paymentData.completed === true || paymentData.qrCodePaymentCheck === true);
                                       
              console.log('Is valid payment data:', isValidPaymentData);
              
              if (isValidPaymentData) {
                console.log('Valid payment data found in session, proceeding with enrollment');
                
                // Process enrollment
                const success = await enrollStudentInCourse(courseId, userId);
                
                if (success) {
                  console.log('Enrollment successful');
                  
                  // Double verify enrollment was successful
                  const enrollmentConfirmed = await forceVerifyEnrollment(courseId, userId);
                  if (enrollmentConfirmed) {
                    onEnrollmentSuccess();
                    toast.success('Enrollment Successful', {
                      description: 'You are now enrolled in the course'
                    });
                  } else {
                    toast.error('Enrollment Status Issue', {
                      description: 'There was an issue with your enrollment. Please refresh or contact support.'
                    });
                  }
                  
                  // Mark payment as processed in session storage
                  const updatedPaymentData = {
                    ...paymentData,
                    processed: true,
                    enrollmentCompleted: true,
                    enrollmentTime: Date.now(),
                    enrollmentVerified: enrollmentConfirmed
                  };
                  sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(updatedPaymentData));
                  
                  // Remove enrollment parameter from URL
                  navigate(`/courses/${courseId}`, { replace: true });
                } else {
                  // Don't show error to avoid confusion
                  console.error('Enrollment failed after payment verification');
                  navigate(`/courses/${courseId}`, { replace: true });
                }
              } else {
                // No need to show error here, just log it
                console.log('Payment data validation failed or not found');
                // Still remove the parameters to avoid repeated attempts
                navigate(`/courses/${courseId}`, { replace: true });
              }
            } else {
              console.log('No payment data found, but URL indicates success');
              // In case of QR code payment or other external payment
              // we'll try one more direct enrollment attempt
              const success = await enrollStudentInCourse(courseId, userId);
              
              if (success) {
                // Double verify enrollment was successful
                const enrollmentConfirmed = await forceVerifyEnrollment(courseId, userId);
                if (enrollmentConfirmed) {
                  console.log('Enrollment successful via direct attempt');
                  onEnrollmentSuccess();
                  toast.success('Enrollment Successful', {
                    description: 'You are now enrolled in the course'
                  });
                } else {
                  console.error('Database verification failed after enrollment');
                }
              }
              
              // Always clean up the URL
              navigate(`/courses/${courseId}`, { replace: true });
            }
          }
        } catch (error) {
          console.error('Error processing payment verification:', error);
          // Don't show error toast to avoid confusion
          // Just clean up the URL
          navigate(`/courses/${courseId}`, { replace: true });
        } finally {
          setIsProcessing(false);
          setEnrollmentProcessing(false);
        }
      }
    };

    // Execute verification when component mounts or URL parameters change
    verifyPayment();
    
    // Check for QR code payments periodically for a short time after page load
    // This helps with redirect issues after QR payments
    let qrCheckAttempts = 0;
    const maxQrCheckAttempts = 10; // Increase check attempts
    const qrCheckInterval = setInterval(async () => {
      qrCheckAttempts++;
      
      // Only check a limited number of times and only if needed
      if (qrCheckAttempts > maxQrCheckAttempts || isEnrolled || isProcessing || !userId || !courseId) {
        clearInterval(qrCheckInterval);
        return;
      }
      
      // Don't check too frequently if we're in later attempts
      if (qrCheckAttempts > 5) {
        console.log(`QR check attempt ${qrCheckAttempts}/${maxQrCheckAttempts}`);
      }
      
      try {
        // First check if already enrolled
        const enrollmentConfirmed = await forceVerifyEnrollment(courseId, userId);
        if (enrollmentConfirmed && !isEnrolled) {
          console.log('Enrollment detected during QR check polling');
          onEnrollmentSuccess();
          toast.success('Payment Confirmed', {
            description: 'Your enrollment has been processed successfully'
          });
          clearInterval(qrCheckInterval);
          return;
        }
        
        // Check if there's any pending QR code payment in session storage
        const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
        if (paymentDataStr) {
          const paymentData = JSON.parse(paymentDataStr);
          if (paymentData.qrCodePaymentCheck && !paymentData.processed) {
            console.log('QR code payment check in progress, checking database status');
            
            // Check if payment is processed in database
            const isPaymentProcessed = await checkPaymentProcessed(courseId, userId);
            
            if (isPaymentProcessed) {
              console.log('QR payment found in database, proceeding with enrollment');
              const success = await enrollStudentInCourse(courseId, userId);
              
              if (success) {
                const finalCheck = await forceVerifyEnrollment(courseId, userId);
                if (finalCheck) {
                  onEnrollmentSuccess();
                  toast.success('QR Code Payment Confirmed', {
                    description: 'Your enrollment has been processed successfully'
                  });
                  
                  // Update session storage
                  const updatedPaymentData = {
                    ...paymentData,
                    processed: true,
                    enrollmentCompleted: true,
                    enrollmentTime: Date.now(),
                    enrollmentVerified: true
                  };
                  sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(updatedPaymentData));
                  
                  clearInterval(qrCheckInterval);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error during QR code payment check:', error);
      }
    }, 3000); // Check every 3 seconds
    
    return () => {
      clearInterval(qrCheckInterval);
    };
  }, [searchParams, isEnrolled, isProcessing, userId, courseId, navigate, onEnrollmentSuccess, setEnrollmentProcessing]);
};
