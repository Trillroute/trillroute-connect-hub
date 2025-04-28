
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
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Check for payment intent in session storage on initial load
  useEffect(() => {
    const checkPaymentIntent = () => {
      const paymentIntentString = sessionStorage.getItem('paymentIntent');
      if (paymentIntentString) {
        try {
          const paymentIntent = JSON.parse(paymentIntentString);
          console.log('CourseDetail: Found payment intent in session storage:', paymentIntent);
          
          // If payment intent exists for the current course
          if (paymentIntent.courseId === courseId) {
            if (paymentIntent.completed && !paymentIntent.handled) {
              console.log('CourseDetail: Found unhandled completed payment for current course');
              // Display toast to inform user we're processing their payment
              toast.info('Verifying Payment', {
                description: 'Please wait while we verify your payment...'
              });
            } else if (paymentIntent.completed && paymentIntent.handled) {
              console.log('CourseDetail: Payment was already handled');
              // Check enrollment status to make sure it was actually processed
              if (user && !isEnrolled && !loading) {
                isStudentEnrolledInCourse(courseId || '', user.id)
                  .then(enrolled => {
                    if (enrolled && !isEnrolled) {
                      console.log('User is enrolled but state doesn\'t reflect it. Refreshing...');
                      setIsEnrolled(true);
                      fetchCourse();
                    }
                  })
                  .catch(err => console.error('Error checking enrollment:', err));
              }
            }
          }
        } catch (error) {
          console.error('Error parsing payment intent:', error);
        }
      }
    };
    
    if (courseId && user) {
      checkPaymentIntent();
    }
  }, [courseId, user, isEnrolled, loading]);

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
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError("Failed to load course information. Please check your connection and try again.");
        setLoading(false);
      }
    }
  }, [courseId, getCourseById, user]);

  const handleEnrollmentSuccess = useCallback(() => {
    console.log('Enrollment success callback triggered');
    setIsEnrolled(true);
    // Refetch course data to get updated student list
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
