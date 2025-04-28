
import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useTeachers } from '@/hooks/useTeachers';
import { useAuth } from '@/hooks/useAuth';
import { CourseNotFound } from '@/components/courses/CourseNotFound';
import { CourseHeader } from '@/components/courses/CourseHeader';
import { CourseContent } from '@/components/courses/CourseContent';
import { CourseDetailTabs } from '@/components/courses/CourseDetailTabs';
import { CourseDetailLoading } from '@/components/courses/CourseDetailLoading';
import { CourseDetailError } from '@/components/courses/CourseDetailError';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { toast } from 'sonner';
import { isStudentEnrolledInCourse } from '@/utils/enrollmentUtils';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { getCourseById } = useCourses();
  const { teachers } = useTeachers();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentProcessing, setEnrollmentProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentChecked, setEnrollmentChecked] = useState(false);

  // Check for payment data on initial load
  useEffect(() => {
    if (!courseId || !user) return;
    
    const checkPaymentData = async () => {
      // Check for payment data in session storage
      const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
      
      if (paymentDataStr) {
        try {
          const paymentData = JSON.parse(paymentDataStr);
          
          console.log('Found payment data for course:', courseId, paymentData);
          
          // If payment was completed but not processed, show info toast
          if (paymentData.completed && !paymentData.processed) {
            toast.info('Verifying Your Payment', {
              description: 'Please wait while we process your enrollment...'
            });
          }
          
          // Check enrollment status directly
          if (user.id) {
            const enrolled = await isStudentEnrolledInCourse(courseId, user.id);
            
            // If user is enrolled but our state doesn't show it, update state and refetch course
            if (enrolled && !isEnrolled) {
              console.log('User is enrolled but state does not reflect it, updating...');
              setIsEnrolled(true);
              fetchCourse();
            }
            
            // If payment is completed but user is not enrolled, something went wrong
            if (paymentData.completed && !enrolled && !enrollmentProcessing) {
              console.log('Payment completed but enrollment not processed');
              // Add enrollment=success to URL to trigger usePaymentVerification
              if (!window.location.href.includes('enrollment=success')) {
                window.history.replaceState(
                  {}, 
                  '', 
                  `${window.location.pathname}?enrollment=success`
                );
                window.location.reload();
              }
            }
          }
        } catch (error) {
          console.error('Error checking payment data:', error);
        }
      }
    };
    
    checkPaymentData();
  }, [courseId, user, isEnrolled, enrollmentProcessing]);

  // Fetch course data
  const fetchCourse = useCallback(async () => {
    if (courseId) {
      try {
        console.log('Fetching course data for ID:', courseId);
        setError(null);
        const courseData = await getCourseById(courseId);
        
        if (!courseData) {
          console.error('Course not found for ID:', courseId);
          setError("Course not found. It may have been removed or is temporarily unavailable.");
          setLoading(false);
          return;
        }
        
        console.log('Course data received:', courseData);
        setCourse(courseData);
        
        // Check if current user is enrolled in this course
        if (user && courseData.student_ids) {
          const userIsEnrolled = Array.isArray(courseData.student_ids) && 
                                courseData.student_ids.includes(user.id);
          console.log('User enrollment status:', userIsEnrolled);
          setIsEnrolled(userIsEnrolled);
          setEnrollmentChecked(true);
        } else {
          setEnrollmentChecked(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError("Failed to load course information. Please check your connection and try again.");
        setLoading(false);
      }
    }
  }, [courseId, getCourseById, user]);

  // Handle successful enrollment
  const handleEnrollmentSuccess = useCallback(() => {
    console.log('Enrollment success callback triggered');
    setIsEnrolled(true);
    fetchCourse();
  }, [fetchCourse]);

  // Initial course fetch
  useEffect(() => {
    console.log('CourseDetail component mounted with courseId:', courseId);
    fetchCourse();
  }, [fetchCourse]);
  
  // Refetch course data when user changes
  useEffect(() => {
    if (user) {
      console.log('User changed, refetching course data');
      fetchCourse();
    }
  }, [user, fetchCourse]);
  
  // Double-check enrollment status if payment verification is present in URL
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (courseId && user?.id && enrollmentChecked && 
          window.location.href.includes('enrollment=success')) {
        try {
          console.log('Double-checking enrollment status');
          const enrolled = await isStudentEnrolledInCourse(courseId, user.id);
          if (enrolled && !isEnrolled) {
            console.log('User is enrolled but state does not match, updating');
            setIsEnrolled(true);
            fetchCourse();
          }
        } catch (error) {
          console.error('Error checking enrollment status:', error);
        }
      }
    };
    
    checkEnrollmentStatus();
  }, [courseId, user, enrollmentChecked, isEnrolled, fetchCourse]);

  // Initialize payment verification hook
  usePaymentVerification(
    courseId || '',
    user?.id,
    isEnrolled,
    setEnrollmentProcessing,
    handleEnrollmentSuccess
  );

  const getInstructorNames = () => {
    if (!course?.instructor_ids || !Array.isArray(course.instructor_ids)) {
      return 'No instructors assigned';
    }
    return course.instructor_ids
      .map(id => {
        const teacher = teachers.find(t => t.id === id);
        return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown';
      })
      .join(', ');
  };

  if (loading) {
    return <CourseDetailLoading />;
  }

  if (error) {
    return (
      <CourseDetailError 
        error={error}
        onRetry={() => { setLoading(true); fetchCourse(); }}
      />
    );
  }

  if (!course) {
    return <CourseNotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseHeader
        course={course}
        isEnrolled={isEnrolled}
        enrollmentProcessing={enrollmentProcessing}
        onNavigateBack={() => window.history.back()}
        onEnrollmentSuccess={handleEnrollmentSuccess}
        onEnrollmentError={(error) => {
          console.error('Enrollment error:', error);
          toast.error("Enrollment Error", {
            description: "Please try again or contact support"
          });
        }}
        courseId={courseId as string}
      />

      <CourseContent 
        course={course}
        getInstructorNames={getInstructorNames}
      />

      <CourseDetailTabs 
        course={course}
        getInstructorNames={getInstructorNames}
      />
    </div>
  );
};

export default CourseDetail;
