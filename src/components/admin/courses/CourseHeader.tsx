
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import ViewControls from './ViewControls';

interface CourseHeaderProps {
  viewMode: 'list' | 'grid' | 'tile';
  setViewMode: (mode: 'list' | 'grid' | 'tile') => void;
  onRefresh: () => void;
  canAddCourse: boolean;
  onAddCourse: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  viewMode,
  setViewMode,
  onRefresh,
  canAddCourse,
  onAddCourse
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>Course Management</CardTitle>
        <CardDescription>Manage courses and lessons</CardDescription>
      </div>
      <ViewControls 
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRefresh={onRefresh}
        canAddCourse={canAddCourse}
        onAddCourse={onAddCourse}
      />
    </div>
  );
};

export default CourseHeader;
