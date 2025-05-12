
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/types/course';
import { BackButton } from './BackButton';
import { EnrollmentButton } from './EnrollmentButton';
import { useEnrollmentStatus } from './useEnrollmentStatus';
import BookTrialDialog from '../scheduler/BookTrialDialog';

interface CourseHeaderProps {
  course: Course;
  isEnrolled: boolean;
  enrollmentProcessing: boolean;
  onEnrollmentSuccess: (response: any) => void;
  onEnrollmentError: (error: any) => void;
  courseId: string;
  onNavigateBack?: () => void;
}

export const CourseHeader = ({
  course,
  isEnrolled: initialIsEnrolled,
  enrollmentProcessing,
  onEnrollmentSuccess,
  onEnrollmentError,
  courseId,
  onNavigateBack
}: CourseHeaderProps) => {
  const navigate = useNavigate();
  
  const {
    isEnrolled,
    enrollmentVerified,
    hasTakenTrial,
    checkingTrial,
    isBookTrialOpen,
    setIsBookTrialOpen,
    handleBookTrial
  } = useEnrollmentStatus(courseId, initialIsEnrolled);

  const handleNavigateBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      navigate('/courses');
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <BackButton onNavigateBack={handleNavigateBack} />
      
      <div>
        <EnrollmentButton
          isEnrolled={isEnrolled}
          enrollmentVerified={enrollmentVerified}
          checkingTrial={checkingTrial}
          enrollmentProcessing={enrollmentProcessing}
          hasTakenTrial={hasTakenTrial}
          courseId={courseId}
          finalPrice={course.final_price || 0}
          onEnrollmentSuccess={onEnrollmentSuccess}
          onEnrollmentError={onEnrollmentError}
          onBookTrial={handleBookTrial}
        />
      </div>
      
      {isBookTrialOpen && (
        <BookTrialDialog
          isOpen={isBookTrialOpen}
          onClose={() => setIsBookTrialOpen(false)}
          courseId={courseId}
          courseTitle={course.title}
        />
      )}
    </div>
  );
};
