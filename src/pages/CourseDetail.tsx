
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

  const fetchCourse = useCallback(async () => {
    if (courseId) {
      try {
        console.log('Fetching course data for ID:', courseId);
        setError(null);
        const courseData = await getCourseById(courseId);
        
        if (!courseData) {
          console.error('Course not found for ID:', courseId);
          setError("Course not found. It may have been removed or is temporarily unavailable.");
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
      } catch (error) {
        console.error('Error fetching course:', error);
        setError("Failed to load course information. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
  }, [courseId, getCourseById, user]);

  const handleEnrollmentSuccess = useCallback(() => {
    console.log('Enrollment success callback triggered');
    setIsEnrolled(true);
  }, []);

  // Initial course fetch
  useEffect(() => {
    console.log('CourseDetail component mounted with courseId:', courseId);
    fetchCourse();
  }, [fetchCourse]);

  // Payment verification effect
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
