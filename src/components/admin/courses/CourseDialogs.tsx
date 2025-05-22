
import React from 'react';
import { Course } from '@/types/course';
import CreateCourseDialog from './CreateCourseDialog';
import ViewCourseDialog from './ViewCourseDialog';
import EditCourseDialog from './EditCourseDialog';
import DeleteCourseDialog from './DeleteCourseDialog';

interface CourseDialogsProps {
  selectedCourse: Course | null;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  fetchCourses: () => void;
  canEditCourse: boolean;
  canDeleteCourse: boolean;
}

const CourseDialogs: React.FC<CourseDialogsProps> = ({
  selectedCourse,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  fetchCourses,
  canEditCourse,
  canDeleteCourse
}) => {
  return (
    <>
      <CreateCourseDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSuccess={fetchCourses}
      />
      
      {selectedCourse && (
        <>
          <ViewCourseDialog
            isOpen={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            course={selectedCourse}
            onSuccess={fetchCourses}
          />
          
          {canEditCourse && (
            <EditCourseDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              course={selectedCourse}
              onSuccess={fetchCourses}
            />
          )}
          
          {canDeleteCourse && (
            <DeleteCourseDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              course={selectedCourse}
              onSuccess={fetchCourses}
            />
          )}
        </>
      )}
    </>
  );
};

export default CourseDialogs;
