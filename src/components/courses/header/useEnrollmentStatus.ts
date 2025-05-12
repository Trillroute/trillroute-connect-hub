
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { hasTrialForCourse } from '@/services/availability/teaching';

export const useEnrollmentStatus = (courseId: string, initialIsEnrolled: boolean) => {
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(initialIsEnrolled);
  const [enrollmentVerified, setEnrollmentVerified] = useState(false);
  const [hasTakenTrial, setHasTakenTrial] = useState(false);
  const [checkingTrial, setCheckingTrial] = useState(false);
  const [isBookTrialOpen, setIsBookTrialOpen] = useState(false);
  
  // Check if student has taken a trial class for this course
  useEffect(() => {
    const checkTrialStatus = async () => {
      if (user && user.role === 'student' && courseId) {
        setCheckingTrial(true);
        try {
          const hasTrial = await hasTrialForCourse(user.id, courseId);
          setHasTakenTrial(hasTrial);
        } catch (error) {
          console.error('Error checking trial status:', error);
        } finally {
          setCheckingTrial(false);
        }
      }
    };
    
    checkTrialStatus();
  }, [user, courseId]);

  const handleBookTrial = () => {
    setIsBookTrialOpen(true);
  };
  
  return {
    isEnrolled,
    setIsEnrolled,
    enrollmentVerified,
    setEnrollmentVerified,
    hasTakenTrial,
    checkingTrial,
    isBookTrialOpen,
    setIsBookTrialOpen,
    handleBookTrial
  };
};
