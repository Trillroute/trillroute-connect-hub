
import React from 'react';
import { Course } from '@/types/course';
import CourseTable from './CourseTable';
import CourseGridView from './CourseGridView';
import CourseTileView from './CourseTileView';

interface CourseContentProps {
  courses: Course[];
  loading: boolean;
  viewMode: 'list' | 'grid' | 'tile';
  onView: (course: Course) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const CourseContent: React.FC<CourseContentProps> = ({
  courses,
  loading,
  viewMode,
  onView,
  onEdit,
  onDelete,
  onBulkDelete
}) => {
  console.log(`CourseContent rendering in ${viewMode} mode with ${courses.length} courses`);
  
  // Add "No courses found" message when the courses array is empty
  if (courses.length === 0 && !loading) {
    return (
      <div className="py-10 text-center">
        <h3 className="text-lg font-medium text-gray-500">No courses found</h3>
        <p className="text-sm text-gray-400 mt-2">Try changing your search criteria or add a new course.</p>
      </div>
    );
  }
  
  if (viewMode === 'list') {
    return (
      <div className="w-full overflow-x-auto">
        <CourseTable 
          courses={courses} 
          loading={loading} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onBulkDelete={onBulkDelete}
        />
      </div>
    );
  }
  
  if (viewMode === 'grid') {
    return (
      <CourseGridView 
        courses={courses} 
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }
  
  return (
    <CourseTileView 
      courses={courses} 
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default CourseContent;
