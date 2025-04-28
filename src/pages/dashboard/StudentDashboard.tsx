
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UpcomingLesson, RecommendedCourse } from '@/types/student-dashboard';
import { DashboardStats } from '@/components/dashboard/student/DashboardStats';
import { EnrolledCoursesSection } from '@/components/dashboard/student/EnrolledCoursesSection';
import { UpcomingLessonsCard } from '@/components/dashboard/student/UpcomingLessonsCard';
import { RecommendedCoursesCard } from '@/components/dashboard/student/RecommendedCoursesCard';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { enrolledCourses, loading: coursesLoading, refreshCourses } = useEnrolledCourses();
  const location = useLocation();
  const navigate = useNavigate();
  
  // These would be replaced with actual API calls in a full implementation
  const upcomingLessons: UpcomingLesson[] = [];
  const recommendations: RecommendedCourse[] = [];

  // Check for payment success via sessionStorage
  useEffect(() => {
    const paymentIntent = sessionStorage.getItem('paymentIntent');
    
    if (paymentIntent) {
      const intent = JSON.parse(paymentIntent);
      
      if (intent.completed) {
        toast.success('Enrollment Successful', {
          description: 'You have been successfully enrolled in the course'
        });
        
        // Clear the payment intent
        sessionStorage.removeItem('paymentIntent');
        
        // Refresh enrolled courses to show the new one
        refreshCourses();
        
        // If we have a courseId, navigate to it
        if (intent.courseId) {
          navigate(`/courses/${intent.courseId}`);
        }
      }
    }
  }, [navigate, refreshCourses]);

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-lg text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your musical journey with Trillroute.</p>
      </div>

      <DashboardStats enrolledCoursesCount={enrolledCourses.length} />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Courses</h2>
        <EnrolledCoursesSection courses={enrolledCourses} loading={coursesLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UpcomingLessonsCard lessons={upcomingLessons} />
        </div>
        <div>
          <RecommendedCoursesCard courses={recommendations} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
