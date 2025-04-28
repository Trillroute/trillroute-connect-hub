
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { forceVerifyEnrollment, enrollStudentInCourse } from '@/utils/enrollment';
import { checkPaymentProcessed } from '@/utils/orderUtils';

export const useEnrollmentCheck = (
  courseId: string,
  userId: string | undefined,
  isEnrolled: boolean,
  setEnrollmentProcessing: (value: boolean) => void,
  onEnrollmentSuccess: () => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const processEnrollment = async () => {
    if (!userId || !courseId || isEnrolled || isProcessing) return false;
    
    try {
      const actuallyEnrolled = await forceVerifyEnrollment(courseId, userId);
      if (actuallyEnrolled) {
        console.log('User is already enrolled according to database check');
        onEnrollmentSuccess();
        toast.success('You are enrolled in this course');
        navigate(`/courses/${courseId}`, { replace: true });
        setIsProcessing(false);
        setEnrollmentProcessing(false);
        return true;
      }

      const isPaymentProcessed = await checkPaymentProcessed(courseId, userId);
      if (isPaymentProcessed) {
        const success = await enrollStudentInCourse(courseId, userId);
        if (success) {
          const enrollmentConfirmed = await forceVerifyEnrollment(courseId, userId);
          if (enrollmentConfirmed) {
            onEnrollmentSuccess();
            toast.success('Enrollment Successful');
            navigate(`/courses/${courseId}`, { replace: true });
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error in enrollment check:', error);
      return false;
    } finally {
      setIsProcessing(false);
      setEnrollmentProcessing(false);
    }
  };

  return {
    processEnrollment,
    isProcessing,
    setIsProcessing
  };
};
