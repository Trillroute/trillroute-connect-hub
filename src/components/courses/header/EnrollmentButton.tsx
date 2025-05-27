
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { PaymentButton } from '@/components/PaymentButton';

interface EnrollmentButtonProps {
  isEnrolled: boolean;
  enrollmentVerified: boolean;
  checkingTrial: boolean;
  enrollmentProcessing: boolean;
  hasTakenTrial: boolean;
  courseId: string;
  finalPrice: number;
  onEnrollmentSuccess: (response: any) => void;
  onEnrollmentError: (error: any) => void;
  onBookTrial: () => void;
}

export const EnrollmentButton: React.FC<EnrollmentButtonProps> = ({
  isEnrolled,
  enrollmentVerified,
  checkingTrial,
  enrollmentProcessing,
  hasTakenTrial,
  courseId,
  finalPrice,
  onEnrollmentSuccess,
  onEnrollmentError,
  onBookTrial,
}) => {
  const { user } = useAuth();

  const canEnroll = () => {
    return user && user.role === 'student';
  };
  
  if (!enrollmentVerified || checkingTrial) {
    return (
      <Button
        disabled={true}
        className="bg-gray-400 text-white cursor-not-allowed opacity-70"
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Verifying...
      </Button>
    );
  }
  
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

  if (enrollmentProcessing) {
    return (
      <Button
        disabled={true}
        className="bg-[#9b87f5] text-white opacity-90 cursor-not-allowed"
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing...
      </Button>
    );
  }
  
  // Show "Book Trial" button if the student hasn't taken a trial yet
  if (!hasTakenTrial) {
    return (
      <div className="flex gap-3">
        <Button
          onClick={onBookTrial}
          className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
        >
          Book Trial
        </Button>
        
        <PaymentButton
          courseId={courseId}
          amount={finalPrice}
          studentId={user.id}
          onSuccess={onEnrollmentSuccess}
          onError={onEnrollmentError}
          className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
        >
          Enroll Now
        </PaymentButton>
      </div>
    );
  }

  // If the student has already taken a trial, show only the enroll button
  return (
    <PaymentButton
      courseId={courseId}
      amount={finalPrice}
      studentId={user.id}
      onSuccess={onEnrollmentSuccess}
      onError={onEnrollmentError}
      className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
    >
      Enroll Now
    </PaymentButton>
  );
};
