
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { PaymentButton } from '@/components/PaymentButton';
import { Course } from '@/types/course';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const displayPrice = course.final_price || course.base_price || 0;
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  
  // Function to check if user can enroll
  const canEnroll = () => {
    // User must be logged in and have the student role
    return user && user.role === 'student';
  };
  
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
    
    if (canEnroll()) {
      checkPendingEnrollment();
    }
  }, [courseId]);
  
  const handlePaymentSuccess = (response: any) => {
    toast.success("Payment Successful", {
      description: "Your enrollment is being processed."
    });
    onEnrollmentSuccess(response);
  };

  const renderEnrollmentButton = () => {
    if (!user) {
      return (
        <Button
          className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
          onClick={() => toast.error("Please login to enroll in this course")}
        >
          Login to Enroll
        </Button>
      );
    }

    if (!canEnroll()) {
      return (
        <Button
          disabled={true}
          className="bg-gray-400 text-white cursor-not-allowed opacity-50"
        >
          Only Students Can Enroll
        </Button>
      );
    }

    if (isEnrolled) {
      return (
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white transition-colors"
          disabled={true}
        >
          <Check className="mr-2 h-4 w-4" />
          Enrolled
        </Button>
      );
    }

    if (checkingEnrollment || enrollmentProcessing) {
      return (
        <Button
          disabled={true}
          className="bg-[#9b87f5] text-white opacity-90 cursor-not-allowed"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying Payment...
        </Button>
      );
    }

    return (
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
    );
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
      
      {renderEnrollmentButton()}
    </div>
  );
};
