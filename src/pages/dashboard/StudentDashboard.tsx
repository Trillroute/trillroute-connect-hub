
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { EnrolledCourse, UpcomingLesson, RecommendedCourse } from '@/types/student-dashboard';
import { DashboardStats } from '@/components/dashboard/student/DashboardStats';
import { EnrolledCoursesSection } from '@/components/dashboard/student/EnrolledCoursesSection';
import { UpcomingLessonsCard } from '@/components/dashboard/student/UpcomingLessonsCard';
import { RecommendedCoursesCard } from '@/components/dashboard/student/RecommendedCoursesCard';

const StudentDashboard = () => {
  const { user } = useAuth();
  const enrolledCourses: EnrolledCourse[] = [];
  const upcomingLessons: UpcomingLesson[] = [];
  const recommendations: RecommendedCourse[] = [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your musical journey with Trillroute.</p>
      </div>

      <DashboardStats enrolledCoursesCount={enrolledCourses.length} />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Courses</h2>
        <EnrolledCoursesSection courses={enrolledCourses} />
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
