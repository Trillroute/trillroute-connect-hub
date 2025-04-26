
import React from 'react';
import { EnrolledCourse } from '@/types/student-dashboard';
import { EnrolledCourseCard } from './EnrolledCourseCard';
import { Skeleton } from '@/components/ui/skeleton';

interface EnrolledCoursesSectionProps {
  courses: EnrolledCourse[];
  loading?: boolean;
}

export const EnrolledCoursesSection: React.FC<EnrolledCoursesSectionProps> = ({ 
  courses, 
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolled courses yet</h3>
        <p className="text-gray-600">Browse our catalog to find courses that interest you and start learning today.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <EnrolledCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
