
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { enrollStudentInCourse, forceVerifyEnrollment } from '@/utils/enrollment';
import { PaymentData } from '../usePaymentData';

export const useQRPayment = (
  courseId: string,
  userId: string | undefined,
  isEnrolled: boolean,
  setEnrollmentProcessing: (value: boolean) => void,
  onEnrollmentSuccess: () => void,
  isProcessing: boolean,
  setIsProcessing: (value: boolean) => void
) => {
  const navigate = useNavigate();

  const processQRPayment = async () => {
    if (!userId || !courseId || isEnrolled || isProcessing) return false;

    console.log('Processing QR payment...');
    try {
      const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
      if (!paymentDataStr) return false;

      const paymentData = JSON.parse(paymentDataStr) as PaymentData;
      if (paymentData.qrCodePaymentCheck && !paymentData.processed && 
          paymentData.courseId === courseId && paymentData.userId === userId) {
            
        console.log('QR payment check data found, attempting enrollment');
        const success = await enrollStudentInCourse(courseId, userId);
        
        if (success) {
          const enrollmentConfirmed = await forceVerifyEnrollment(courseId, userId);
          if (enrollmentConfirmed) {
            onEnrollmentSuccess();
            toast.success('QR Payment Confirmed', {
              description: 'You are now enrolled in the course'
            });
            
            const updatedData = { 
              ...paymentData, 
              processed: true,
              completed: true,
              completedTime: Date.now(),
              enrollmentCompleted: true
            };
            sessionStorage.setItem(`payment_${courseId}`, JSON.stringify(updatedData));
            
            navigate(`/courses/${courseId}`, { replace: true });
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error processing QR payment:', error);
      return false;
    }
  };

  useEffect(() => {
    const qrCheckInterval = setInterval(async () => {
      if (isEnrolled || isProcessing || !userId || !courseId) return;
      
      console.log('Running periodic QR payment check');
      await processQRPayment();
    }, 3000);
    
    return () => clearInterval(qrCheckInterval);
  }, [courseId, userId, isEnrolled, isProcessing]);

  return {
    processQRPayment
  };
};
