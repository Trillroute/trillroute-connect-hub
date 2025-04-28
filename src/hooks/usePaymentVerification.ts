
import { useEnrollmentCheck } from './payment-verification/useEnrollmentCheck';
import { useQRPayment } from './payment-verification/useQRPayment';
import { useURLPaymentVerification } from './payment-verification/useURLPaymentVerification';

export const usePaymentVerification = (
  courseId: string,
  userId: string | undefined,
  isEnrolled: boolean,
  setEnrollmentProcessing: (value: boolean) => void,
  onEnrollmentSuccess: () => void
) => {
  const { processEnrollment, isProcessing, setIsProcessing } = useEnrollmentCheck(
    courseId,
    userId,
    isEnrolled,
    setEnrollmentProcessing,
    onEnrollmentSuccess
  );

  const { processQRPayment } = useQRPayment(
    courseId,
    userId,
    isEnrolled,
    setEnrollmentProcessing,
    onEnrollmentSuccess,
    isProcessing,
    setIsProcessing
  );

  useURLPaymentVerification(
    courseId,
    userId,
    isEnrolled,
    isProcessing,
    setEnrollmentProcessing,
    setIsProcessing,
    processEnrollment,
    processQRPayment
  );
};
