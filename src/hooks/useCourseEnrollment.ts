
import { useState } from 'react';
import { toast } from 'sonner';
import { useTrialVerification } from './enrollment/useTrialVerification';
import { useStudentEnrollment } from './enrollment/useStudentEnrollment';
import { usePaymentLink } from './enrollment/usePaymentLink';

export function useCourseEnrollment() {
  const [loading, setLoading] = useState(false);
  
  const { hasCompletedTrialForCourse } = useTrialVerification();
  const { addStudentToCourse: enrollStudent } = useStudentEnrollment();
  const { generatePaymentLink: createPaymentLink } = usePaymentLink();

  // Add a student to a course with trial verification
  const addStudentToCourse = async (
    courseId: string, 
    studentId: string,
    teacherId?: string,
    additionalMetadata?: Record<string, any>
  ) => {
    if (!courseId || !studentId) return false;
    
    setLoading(true);
    try {
      console.log('Starting enrollment process for student:', studentId, 'course:', courseId);
      
      // CRITICAL CHECK: Verify student has completed trial for this specific course
      const hasTrialCompleted = await hasCompletedTrialForCourse(studentId, courseId);
      
      if (!hasTrialCompleted) {
        toast.error('Student must complete a trial class for this course before enrollment');
        console.error('Enrollment blocked: Student has not completed trial for course', { studentId, courseId });
        setLoading(false);
        return false;
      }

      const result = await enrollStudent(courseId, studentId, teacherId, additionalMetadata);
      setLoading(false);
      return result;
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('An error occurred during enrollment');
      setLoading(false);
      return false;
    }
  };

  // Generate a payment link for a course with trial verification
  const generatePaymentLink = async (courseId: string, studentId: string, amount: number) => {
    if (!courseId || !studentId) return null;
    
    try {
      console.log('Generating payment link for:', { courseId, studentId, amount });
      
      // CRITICAL CHECK: Verify student has completed trial for this specific course before generating payment link
      const hasTrialCompleted = await hasCompletedTrialForCourse(studentId, courseId);
      
      console.log('Trial completion check result:', hasTrialCompleted);
      
      if (!hasTrialCompleted) {
        console.error('Payment link generation blocked: Student has not completed trial for course', { studentId, courseId });
        toast.error('Student must complete a trial class for this course before payment');
        return null;
      }

      return await createPaymentLink(courseId, studentId, amount);
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Failed to generate payment link');
      return null;
    }
  };

  return {
    addStudentToCourse,
    generatePaymentLink,
    loading,
    hasCompletedTrialForCourse
  };
}
