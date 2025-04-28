
import React, { useState, useCallback } from 'react';
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
        setError(null);
        const courseData = await getCourseById(courseId);
        
        if (!courseData) {
          setError("Course not found. It may have been removed or is temporarily unavailable.");
          return;
        }
        
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError("Failed to load course information. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
  }, [courseId, getCourseById]);

  const handleEnrollmentSuccess = useCallback(() => {
    setIsEnrolled(true);
  }, []);

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

