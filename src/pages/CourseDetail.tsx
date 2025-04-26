
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useTeachers } from '@/hooks/useTeachers';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { enrollStudentInCourse, isStudentEnrolledInCourse } from '@/utils/enrollmentUtils';
import { CourseDetailSkeleton } from '@/components/courses/CourseDetailSkeleton';
import { CourseError } from '@/components/courses/CourseError';
import { CourseNotFound } from '@/components/courses/CourseNotFound';
import { CourseHeader } from '@/components/courses/CourseHeader';
import { CourseContent } from '@/components/courses/CourseContent';
import { CourseDetailTabs } from '@/components/courses/CourseDetailTabs';
import { supabase } from '@/integrations/supabase/client';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getCourseById } = useCourses();
  const { teachers } = useTeachers();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentProcessing, setEnrollmentProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          setError(null);
          const courseData = await getCourseById(courseId);
          
          if (!courseData) {
            setError("Course not found. It may have been removed or is temporarily unavailable.");
            setLoading(false);
            return;
          }
          
          setCourse(courseData);
        } catch (error) {
          console.error('Error fetching course:', error);
          setError("Failed to load course information. Please check your connection and try again.");
          toast.error('Connection Error', {
            description: 'Could not connect to the server. Please try again later.'
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCourse();
  }, [courseId, getCourseById]);

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (isAuthenticated && user && courseId) {
        try {
          const enrolled = await isStudentEnrolledInCourse(courseId, user.id);
          setIsEnrolled(enrolled);
        } catch (error) {
          console.error('Error checking enrollment status:', error);
        }
      }
    };

    if (!loading && user && !error) {
      checkEnrollmentStatus();
    }
  }, [loading, courseId, isAuthenticated, user, error]);

  useEffect(() => {
    const processEnrollment = async () => {
      if (isEnrolled || enrollmentProcessing || !user || !courseId) return;
      
      const enrollmentStatus = searchParams.get('enrollment');
      if (enrollmentStatus !== 'success') return;
      
      console.log('Payment success detected, processing enrollment');
      setEnrollmentProcessing(true);
      
      try {
        const paymentIntent = sessionStorage.getItem('paymentIntent');
        console.log('Retrieved payment intent from session storage:', paymentIntent);
        
        if (paymentIntent) {
          const intent = JSON.parse(paymentIntent);
          
          const isValid = 
            intent.courseId === courseId && 
            intent.userId === user.id &&
            (new Date().getTime() - intent.timestamp) < 30 * 60 * 1000; // 30 minute window
            
          if (isValid) {
            console.log('Valid payment intent confirmed, enrolling user');
            
            const { error: paymentError } = await supabase
              .from('payments')
              .update({ 
                status: 'completed',
                updated_at: new Date().toISOString()
              })
              .eq('id', intent.payment_id);

            if (paymentError) {
              console.error('Error updating payment status:', paymentError);
            }
            
            const success = await enrollStudentInCourse(courseId, user.id);
            
            if (success) {
              setIsEnrolled(true);
              toast.success('Course Enrollment', {
                description: `You are now enrolled in ${course?.title}`
              });
              
              sessionStorage.removeItem('paymentIntent');
              navigate(`/courses/${courseId}`, { replace: true });
            } else {
              toast.error('Enrollment Failed', {
                description: 'Please contact support for assistance'
              });
            }
          } else {
            console.error('Invalid or expired payment intent:', {
              storedCourseId: intent.courseId,
              currentCourseId: courseId,
              storedUserId: intent.userId,
              currentUserId: user.id,
              timestamp: intent.timestamp,
              currentTime: new Date().getTime(),
              timeDiff: new Date().getTime() - intent.timestamp
            });
            toast.error('Enrollment Failed', {
              description: 'Invalid or expired payment session'
            });
          }
        } else {
          console.log('No payment intent found in session storage');
        }
      } catch (error) {
        console.error('Error processing enrollment:', error);
        toast.error('Enrollment Failed', {
          description: 'Please try again or contact support'
        });
      } finally {
        setEnrollmentProcessing(false);
      }
    };

    if (!loading && user && course && !isEnrolled && !enrollmentProcessing) {
      console.log('Checking for enrollment processing conditions');
      processEnrollment();
    }
  }, [loading, user, course, courseId, isEnrolled, enrollmentProcessing, navigate, searchParams]);

  const handleEnrollmentSuccess = async (response: any) => {
    if (user && courseId) {
      try {
        console.log('Payment success callback triggered, enrolling student');
        const success = await enrollStudentInCourse(courseId, user.id);
        if (success) {
          setIsEnrolled(true);
          toast.success('Course Enrollment', {
            description: `You are now enrolled in ${course.title}`
          });
        }
      } catch (error) {
        console.error('Error enrolling in course:', error);
        toast.error('Enrollment failed. Please try again.');
      }
    }
  };

  const handleEnrollmentError = (error: any) => {
    toast.error('Payment Failed', {
      description: error.message || 'There was an error processing your payment.'
    });
  };

  const getInstructorNames = () => {
    if (!course.instructor_ids || !Array.isArray(course.instructor_ids)) {
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
    return <CourseDetailSkeleton />;
  }

  if (error) {
    return (
      <CourseError 
        error={error}
        onBack={() => navigate(-1)}
        onRetry={() => window.location.reload()}
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
        onNavigateBack={() => navigate(-1)}
        onEnrollmentSuccess={handleEnrollmentSuccess}
        onEnrollmentError={handleEnrollmentError}
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
