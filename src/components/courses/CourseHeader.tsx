
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { PaymentButton } from '@/components/PaymentButton';
import { Course } from '@/types/course';

interface CourseHeaderProps {
  course: Course;
  isEnrolled: boolean;
  enrollmentProcessing: boolean;
  onNavigateBack: () => void;
  onPaymentSuccess: (response: any) => void;
  onPaymentError: (error: any) => void;
  courseId: string;
}

export const CourseHeader = ({
  course,
  isEnrolled,
  enrollmentProcessing,
  onNavigateBack,
  onPaymentSuccess,
  onPaymentError,
  courseId
}: CourseHeaderProps) => (
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
        className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
        disabled={true}
      >
        <Check className="mr-2 h-4 w-4" />
        Enrolled
      </Button>
    ) : (
      <PaymentButton
        amount={course.final_price || course.base_price || 0}
        onSuccess={onPaymentSuccess}
        onError={onPaymentError}
        className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
        courseId={courseId}
      >
        {enrollmentProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Enroll Now'
        )}
      </PaymentButton>
    )}
  </div>
);
