
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Course } from '@/types/course';
import CourseCard from './CourseCard';

interface CoursesGridProps {
  courses: Course[];
  loading: boolean;
  getInstructorNames: (course: Course) => string;
  emptyMessage?: string;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({ 
  courses, 
  loading, 
  getInstructorNames, 
  emptyMessage = "No courses found" 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600">Try adjusting your filters!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          getInstructorNames={getInstructorNames}
        />
      ))}
    </div>
  );
};

export default CoursesGrid;
