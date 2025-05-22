
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCourses } from '@/hooks/useCourses';
import ViewControls from './courses/ViewControls';
import CourseSearch from './courses/CourseSearch';
import CourseContent from './courses/CourseContent';
import CourseDialogs from './courses/CourseDialogs';
import { useCoursePermissions } from './courses/hooks/useCoursePermissions';
import { useCourseDialogs } from './courses/hooks/useCourseDialogs';
import { useCourseSearch } from './courses/hooks/useCourseSearch';

interface CourseManagementProps {
  canAddCourse?: boolean;
  canDeleteCourse?: boolean;
  canEditCourse?: boolean;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ 
  canAddCourse = true, 
  canDeleteCourse = true,
  canEditCourse = true
}) => {
  const { toast } = useToast();
  const { courses, loading, fetchCourses } = useCourses();
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Custom hooks
  const { 
    effectiveCanEditCourse,
    effectiveCanDeleteCourse,
    effectiveCanAddCourse 
  } = useCoursePermissions(canAddCourse, canDeleteCourse, canEditCourse);
  
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCourse,
    openViewDialog,
    openEditDialog,
    openDeleteDialog,
    handleBulkDelete
  } = useCourseDialogs(fetchCourses, effectiveCanDeleteCourse);
  
  const { searchQuery, setSearchQuery, filteredCourses } = useCourseSearch(courses);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>Manage courses and lessons</CardDescription>
          </div>
          <ViewControls 
            viewMode={viewMode}
            setViewMode={setViewMode}
            onRefresh={fetchCourses}
            canAddCourse={effectiveCanAddCourse}
            onAddCourse={() => setIsCreateDialogOpen(true)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <CourseSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <div className="relative">
          <CourseContent
            courses={filteredCourses}
            loading={loading}
            viewMode={viewMode}
            onView={openViewDialog}
            onEdit={effectiveCanEditCourse ? openEditDialog : undefined}
            onDelete={effectiveCanDeleteCourse ? openDeleteDialog : undefined}
            onBulkDelete={effectiveCanDeleteCourse ? handleBulkDelete : undefined}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        </div>

        <CourseDialogs
          selectedCourse={selectedCourse}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          isViewDialogOpen={isViewDialogOpen}
          setIsViewDialogOpen={setIsViewDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          fetchCourses={fetchCourses}
          canEditCourse={effectiveCanEditCourse}
          canDeleteCourse={effectiveCanDeleteCourse}
        />
      </CardContent>
    </Card>
  );
};

export default CourseManagement;
