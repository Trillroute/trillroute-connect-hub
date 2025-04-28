
import React, { useEffect, useState, useCallback } from 'react';
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
        toast.error('Connection Error', {
          description: 'Could not connect to the server. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    }
  }, [courseId, getCourseById]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const checkEnrollmentStatus = useCallback(async () => {
    if (isAuthenticated && user && courseId) {
      try {
        const enrolled = await isStudentEnrolledInCourse(courseId, user.id);
        setIsEnrolled(enrolled);
        return enrolled;
      } catch (error) {
        console.error('Error checking enrollment status:', error);
        return false;
      }
    }
    return false;
  }, [courseId, isAuthenticated, user]);

  useEffect(() => {
    if (!loading && user && !error) {
      checkEnrollmentStatus();
    }
  }, [loading, checkEnrollmentStatus, user, error]);

  // Check for payment success from URL parameters and session storage
  useEffect(() => {
    const enrollmentStatus = searchParams.get('enrollment');
    
    if (enrollmentStatus === 'success' && !isEnrolled && !enrollmentProcessing && user && courseId) {
      console.log('Payment success detected from URL, processing enrollment');
      setEnrollmentProcessing(true);
      
      // Check for payment intent in session storage
      const paymentIntentString = sessionStorage.getItem('paymentIntent');
      if (paymentIntentString) {
        try {
          const paymentIntent = JSON.parse(paymentIntentString);
          
          // Check if the payment intent is for this course and user
          if (paymentIntent.courseId === courseId && paymentIntent.userId === user.id && paymentIntent.completed) {
            console.log('Valid payment intent found, proceeding with enrollment');
            
            // Process the enrollment
            enrollStudentInCourse(courseId, user.id)
              .then(success => {
                if (success) {
                  setIsEnrolled(true);
                  toast.success('Enrollment Successful', {
                    description: `You are now enrolled in ${course?.title}`
                  });
                  
                  // Mark the payment intent as handled
                  paymentIntent.handled = true;
                  sessionStorage.setItem('paymentIntent', JSON.stringify(paymentIntent));
                  
                  // Clear the URL parameter
                  navigate(`/courses/${courseId}`, { replace: true });
                } else {
                  toast.error('Enrollment Failed', {
                    description: 'Please contact support for assistance'
                  });
                }
              })
              .catch(error => {
                console.error('Error during enrollment:', error);
                toast.error('Enrollment Error', {
                  description: 'Please try again or contact support'
                });
              })
              .finally(() => {
                setEnrollmentProcessing(false);
              });
          } else {
            console.error('Payment intent mismatch or not completed:', {
              storedCourseId: paymentIntent.courseId,
              currentCourseId: courseId,
              storedUserId: paymentIntent.userId,
              currentUserId: user.id,
              completed: paymentIntent.completed
            });
            
            if (!paymentIntent.completed) {
              toast.error('Payment Not Completed', {
                description: 'Your payment was not marked as completed. Please try again.'
              });
            }
            
            setEnrollmentProcessing(false);
          }
        } catch (error) {
          console.error('Error parsing payment intent:', error);
          setEnrollmentProcessing(false);
          toast.error('Payment Data Error', {
            description: 'There was an error processing your payment data'
          });
        }
      } else {
        console.log('No payment intent found in session storage');
        toast.error('Payment Information Missing', {
          description: 'Payment information was lost. Please try again or contact support.'
        });
        setEnrollmentProcessing(false);
      }
    }
    
    // Check enrollment status again regardless to ensure UI is up-to-date
    if (user && courseId && !loading) {
      checkEnrollmentStatus();
    }
  }, [searchParams, isEnrolled, enrollmentProcessing, user, courseId, course, navigate, loading, checkEnrollmentStatus]);

  const handleEnrollmentSuccess = async (response: any) => {
    // This function will be called by the PaymentButton on successful payment
    // Most of the enrollment logic is now handled by the URL parameter check above
    console.log('Payment success callback triggered', response);
  };

  const handleEnrollmentError = (error: any) => {
    toast.error('Payment Failed', {
      description: error.message || 'There was an error processing your payment.'
    });
  };

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
    return <CourseDetailSkeleton />;
  }

  if (error) {
    return (
      <CourseError 
        error={error}
        onBack={() => navigate(-1)}
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
