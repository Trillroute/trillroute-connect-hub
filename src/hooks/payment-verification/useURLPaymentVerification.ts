
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useURLPaymentVerification = (
  courseId: string,
  userId: string | undefined,
  isEnrolled: boolean,
  isProcessing: boolean,
  setEnrollmentProcessing: (value: boolean) => void,
  setIsProcessing: (value: boolean) => void,
  processEnrollment: () => Promise<boolean>,
  processQRPayment: () => Promise<boolean>
) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
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
      
      if ((enrollmentStatus === 'success' || paymentStatus === 'verified') && 
          !isEnrolled && !isProcessing && userId && courseId) {
        console.log('Payment success detected, processing enrollment');
        setIsProcessing(true);
        setEnrollmentProcessing(true);
        await processEnrollment();
      } else if (!isEnrolled && !isProcessing && userId && courseId) {
        await processQRPayment();
      }
    };

    verifyPayment();
  }, [searchParams, isEnrolled, isProcessing, userId, courseId]);
};
