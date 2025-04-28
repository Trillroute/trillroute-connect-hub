
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Course } from '@/types/course';
import { isStudentEnrolledInCourse, forceVerifyEnrollment } from '@/utils/enrollment';
import { PaymentButton } from '@/components/PaymentButton';

interface CourseHeaderProps {
  course: Course;
  isEnrolled: boolean;
  enrollmentProcessing: boolean;
  onEnrollmentSuccess: (response: any) => void;
  onEnrollmentError: (error: any) => void;
  courseId: string;
}

export const CourseHeader = ({
  course,
  isEnrolled: initialIsEnrolled,
  enrollmentProcessing,
  onEnrollmentSuccess,
  onEnrollmentError,
  courseId
}: CourseHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(initialIsEnrolled);
  const [enrollmentVerified, setEnrollmentVerified] = useState(false);
  
  // Verify enrollment status directly from the database on every mount
  useEffect(() => {
    const verifyEnrollmentStatus = async () => {
      if (user && courseId) {
        try {
          console.log('Performing force verification of enrollment status');
          const enrolled = await forceVerifyEnrollment(courseId, user.id);
          
          if (enrolled !== isEnrolled) {
            console.log(`Enrollment status correction needed. DB says: ${enrolled}, UI shows: ${isEnrolled}`);
            setIsEnrolled(enrolled);
          }
          
          setEnrollmentVerified(true);
        } catch (error) {
          console.error('Error during enrollment verification:', error);
          // Default to not enrolled on error to prevent false positives
          setIsEnrolled(false);
          setEnrollmentVerified(true);
        }
      } else {
        setEnrollmentVerified(true);
      }
    };
    
    verifyEnrollmentStatus();
  }, [courseId, user, isEnrolled]);
  
  const canEnroll = () => {
    return user && user.role === 'student';
  };

  const renderEnrollmentButton = () => {
    if (!enrollmentVerified) {
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

    return (
      <PaymentButton
        courseId={courseId}
        amount={course.final_price}
        onSuccess={onEnrollmentSuccess}
        onError={onEnrollmentError}
        className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
      >
        Enroll Now
      </PaymentButton>
    );
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/courses')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>
      
      {renderEnrollmentButton()}
    </div>
  );
};
