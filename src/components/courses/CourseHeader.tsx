
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { PaymentButton } from '@/components/PaymentButton';
import { Course } from '@/types/course';
import { toast } from 'sonner';

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
  
  const handlePaymentSuccess = (response: any) => {
    toast.success("Payment Successful", {
      description: "Your payment has been processed successfully."
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
