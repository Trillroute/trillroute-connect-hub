
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { EnrolledCourse } from '@/types/student-dashboard';
import { EnrolledCourseCard } from './EnrolledCourseCard';

interface EnrolledCoursesSectionProps {
  courses: EnrolledCourse[];
}

export const EnrolledCoursesSection = ({ courses }: EnrolledCoursesSectionProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-8 px-4 border rounded-md">
        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No courses enrolled</h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-4">
          You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
        </p>
        <Link to="/courses">
          <Button className="bg-music-500 hover:bg-music-600">
            Browse Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <EnrolledCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
