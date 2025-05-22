
import React from 'react';
import { Course } from '@/types/course';
import CourseTable from './CourseTable';
import CourseGridView from './CourseGridView';
import CourseTileView from './CourseTileView';

export interface CourseContentProps {
  courses: Course[];
  loading: boolean;
  viewMode: 'list' | 'grid' | 'tile';
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onBulkDelete: (courseIds: string[]) => Promise<void>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const CourseContent: React.FC<CourseContentProps> = ({
  courses,
  loading,
  viewMode,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  selectedIds,
  setSelectedIds
}) => {
  console.info(`CourseContent rendering in ${viewMode} mode with ${courses.length} courses`);

  if (viewMode === 'grid') {
    return (
      <CourseGridView
        courses={courses} 
        loading={loading}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  if (viewMode === 'tile') {
    return (
      <CourseTileView
        courses={courses}
        loading={loading}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <CourseTable
      courses={courses}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onBulkDelete={onBulkDelete}
      selectedCourseIds={selectedIds}
      setSelectedCourseIds={setSelectedIds}
    />
  );
};

export default CourseContent;
