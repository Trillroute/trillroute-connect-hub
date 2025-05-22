
import React from 'react';
import { Course } from '@/types/course';
import CourseTable from './CourseTable';
import CourseGridView from './CourseGridView';
import CourseTileView from './CourseTileView';

interface CourseContentProps {
  courses: Course[];
  loading: boolean;
  viewMode: string;
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  selectedCourses: string[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<string[]>>;
}

const CourseContent: React.FC<CourseContentProps> = ({
  courses,
  loading,
  viewMode,
  onView,
  onEdit,
  onDelete,
  selectedCourses,
  setSelectedCourses
}) => {
  if (viewMode === 'grid') {
    return (
      <CourseGridView
        courses={courses}
        isLoading={loading} // Updated prop name to match component
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
        isLoading={loading} // Updated prop name to match component
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  // Default to table view
  return (
    <CourseTable
      courses={courses}
      loading={loading}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      selectedCourses={selectedCourses}
      setSelectedCourses={setSelectedCourses}
    />
  );
};

export default CourseContent;
