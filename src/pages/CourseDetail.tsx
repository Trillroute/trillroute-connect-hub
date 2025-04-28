
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
import { isStudentEnrolledInCourse, forceVerifyEnrollment } from '@/utils/enrollment';

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

  useEffect(() => {
    if (!courseId || !user) return;
    
    const checkPaymentData = async () => {
      const paymentDataStr = sessionStorage.getItem(`payment_${courseId}`);
      
      if (paymentDataStr) {
        try {
          const paymentData = JSON.parse(paymentDataStr);
          
          console.log('Found payment data for course:', courseId, paymentData);
          
          if (paymentData.completed && !paymentData.processed) {
            toast.info('Verifying Your Payment', {
              description: 'Please wait while we process your enrollment...'
            });
          }
        } catch (error) {
          console.error('Error checking payment data:', error);
        }
      }
    };
    
    checkPaymentData();
  }, [courseId, user]);

  const checkEnrollmentStatus = useCallback(async () => {
    if (courseId && user?.id) {
      try {
        console.log('Checking enrollment status from database');
        // Always use forceVerifyEnrollment to ensure we get the latest database state
        const enrolled = await forceVerifyEnrollment(courseId, user.id);
        console.log('Enrollment status from database:', enrolled);
        setIsEnrolled(enrolled);
        setEnrollmentChecked(true);
        return enrolled;
      } catch (error) {
        console.error('Error checking enrollment status:', error);
        setIsEnrolled(false); // Default to not enrolled on error
        setEnrollmentChecked(true);
        return false;
      }
    }
    setEnrollmentChecked(true);
    return false;
  }, [courseId, user]);

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
        
        if (user) {
          await checkEnrollmentStatus();
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
  }, [courseId, getCourseById, user, checkEnrollmentStatus]);

  const handleEnrollmentSuccess = useCallback(() => {
    console.log('Enrollment success callback triggered');
    checkEnrollmentStatus().then(() => {
      // Re-fetch course to get updated student count and student_ids
      fetchCourse();
    });
  }, [checkEnrollmentStatus, fetchCourse]);

  useEffect(() => {
    console.log('CourseDetail component mounted with courseId:', courseId);
    fetchCourse();
  }, [fetchCourse]);
  
  useEffect(() => {
    if (user) {
      console.log('User changed, refetching course data');
      fetchCourse();
    }
  }, [user, fetchCourse]);
  
  useEffect(() => {
    if (courseId && user?.id && enrollmentChecked && 
        window.location.href.includes('enrollment=success')) {
      checkEnrollmentStatus();
    }
  }, [courseId, user, enrollmentChecked, checkEnrollmentStatus]);

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
