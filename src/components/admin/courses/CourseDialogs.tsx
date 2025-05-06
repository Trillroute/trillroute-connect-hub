
import React from 'react';
import { Course } from '@/types/course';
import CreateCourseDialog from './CreateCourseDialog';
import ViewCourseDialog from './ViewCourseDialog';
import EditCourseDialog from './EditCourseDialog';
import DeleteCourseDialog from './DeleteCourseDialog';

interface CourseDialogsProps {
  isCreateDialogOpen: boolean;
  isViewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  setIsViewDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  selectedCourse: Course | null;
  onSuccess: () => void;
  effectiveCanEditCourse: boolean;
  effectiveCanDeleteCourse: boolean;
  effectiveCanAddCourse: boolean;
}

const CourseDialogs: React.FC<CourseDialogsProps> = ({
  isCreateDialogOpen,
  isViewDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  setIsCreateDialogOpen,
  setIsViewDialogOpen,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  selectedCourse,
  onSuccess,
  effectiveCanEditCourse,
  effectiveCanDeleteCourse,
  effectiveCanAddCourse
}) => {
  if (!selectedCourse && !isCreateDialogOpen) return null;
  
  return (
    <>
      {effectiveCanAddCourse && (
        <CreateCourseDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
          onSuccess={onSuccess}
        />
      )}

      {selectedCourse && (
        <>
          <ViewCourseDialog
            isOpen={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            course={selectedCourse}
            onSuccess={onSuccess}
          />
          
          {effectiveCanEditCourse && (
            <EditCourseDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              course={selectedCourse}
              onSuccess={onSuccess}
            />
          )}
          
          {effectiveCanDeleteCourse && (
            <DeleteCourseDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              course={selectedCourse}
              onSuccess={onSuccess}
            />
          )}
        </>
      )}
    </>
  );
};

export default CourseDialogs;
