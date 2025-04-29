
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
  if (viewMode === 'list') {
    return (
      <CourseTable 
        courses={courses} 
        loading={loading} 
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onBulkDelete={onBulkDelete}
      />
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
