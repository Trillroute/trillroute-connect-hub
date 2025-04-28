import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Course } from '@/types/course';
import { enrollStudentInCourse } from '@/utils/enrollment';

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
  const [processing, setProcessing] = useState(false);
  
  const canEnroll = () => {
    return user && user.role === 'student';
  };
  
  const handleEnrollment = async () => {
    if (!user || !canEnroll()) {
      toast.error("Only students can enroll in courses");
      return;
    }
    
    setProcessing(true);
    try {
      const success = await enrollStudentInCourse(courseId, user.id);
      if (success) {
        toast.success("Successfully Enrolled", {
          description: "You have been enrolled in the course"
        });
        onEnrollmentSuccess({ courseId });
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
      onEnrollmentError(error);
    } finally {
      setProcessing(false);
    }
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

    if (processing || enrollmentProcessing) {
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
      <Button
        onClick={handleEnrollment}
        className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
      >
        Enroll Now
      </Button>
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
