
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { PaymentButton } from '@/components/PaymentButton';
import { Course } from '@/types/course';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface CourseHeaderProps {
  course: Course;
  isEnrolled: boolean;
  enrollmentProcessing: boolean;
  onNavigateBack: () => void;
  onEnrollmentSuccess: (response: any) => void;
  onEnrollmentError: (error: any) => void;
  courseId: string;
}

export const CourseHeader = ({
  course,
  isEnrolled,
  enrollmentProcessing,
  onNavigateBack,
  onEnrollmentSuccess,
  onEnrollmentError,
  courseId
}: CourseHeaderProps) => {
  const displayPrice = course.final_price || course.base_price || 0;
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  
  useEffect(() => {
    // Check if there's any pending enrollment data in the session
    const checkPendingEnrollment = () => {
      try {
        const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
        if (paymentDataStr) {
          const paymentData = JSON.parse(paymentDataStr);
          if (paymentData.completed && !paymentData.processed) {
            setCheckingEnrollment(true);
            // Auto-clear checking status after 5 seconds
            setTimeout(() => setCheckingEnrollment(false), 5000);
          }
        }
      } catch (err) {
        console.error('Error checking pending enrollment:', err);
      }
    };
    
    checkPendingEnrollment();
  }, [courseId]);
  
  const handlePaymentSuccess = (response: any) => {
    toast.success("Payment Successful", {
      description: "Your enrollment is being processed."
    });
    onEnrollmentSuccess(response);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="ghost"
        onClick={onNavigateBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>
      
      {isEnrolled ? (
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white transition-colors"
          disabled={true}
        >
          <Check className="mr-2 h-4 w-4" />
          Enrolled
        </Button>
      ) : checkingEnrollment || enrollmentProcessing ? (
        <Button
          disabled={true}
          className="bg-[#9b87f5] text-white opacity-90 cursor-not-allowed"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying Payment...
        </Button>
      ) : (
        <PaymentButton
          onSuccess={handlePaymentSuccess}
          onError={onEnrollmentError}
          className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
          courseId={courseId}
          amount={displayPrice}
        >
          {enrollmentProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Enroll Now (₹${displayPrice})`
          )}
        </PaymentButton>
      )}
    </div>
  );
};
