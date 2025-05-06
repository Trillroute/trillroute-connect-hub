
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CourseSearch from './courses/CourseSearch';
import CourseContent from './courses/CourseContent';
import CourseHeader from './courses/CourseHeader';
import CourseDialogs from './courses/CourseDialogs';
import { useCourseManagement } from './courses/hooks/useCourseManagement';

interface CourseManagementProps {
  canAddCourse?: boolean;
  canDeleteCourse?: boolean;
  canEditCourse?: boolean;
  selectedTab?: string; // Added for compatibility with DashboardContent
}

const CourseManagement: React.FC<CourseManagementProps> = ({ 
  canAddCourse = true, 
  canDeleteCourse = true,
  canEditCourse = true,
  selectedTab
}) => {
  const {
    isCreateDialogOpen, setIsCreateDialogOpen,
    isViewDialogOpen, setIsViewDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    isDeleteDialogOpen, setIsDeleteDialogOpen,
    selectedCourse, courses, loading, fetchCourses,
    searchQuery, setSearchQuery,
    viewMode, setViewMode,
    getEffectivePermissions,
    openViewDialog,
    openEditDialog,
    openDeleteDialog,
    handleBulkDelete,
    getFilteredCourses
  } = useCourseManagement();
  
  const { 
    effectiveCanEditCourse, 
    effectiveCanDeleteCourse, 
    effectiveCanAddCourse 
  } = getEffectivePermissions(canEditCourse, canDeleteCourse, canAddCourse);

  const filteredCourses = getFilteredCourses(searchQuery, courses);

  const handleBulkDeleteWithPermission = (courseIds: string[]) => {
    handleBulkDelete(courseIds, effectiveCanDeleteCourse);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CourseHeader 
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={fetchCourses}
          canAddCourse={effectiveCanAddCourse}
          onAddCourse={() => setIsCreateDialogOpen(true)}
        />
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
            onBulkDelete={effectiveCanDeleteCourse ? handleBulkDeleteWithPermission : undefined}
          />
        </div>

        <CourseDialogs
          isCreateDialogOpen={isCreateDialogOpen}
          isViewDialogOpen={isViewDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          setIsViewDialogOpen={setIsViewDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          selectedCourse={selectedCourse}
          onSuccess={fetchCourses}
          effectiveCanEditCourse={effectiveCanEditCourse}
          effectiveCanDeleteCourse={effectiveCanDeleteCourse}
          effectiveCanAddCourse={effectiveCanAddCourse}
        />
      </CardContent>
    </Card>
  );
};

export default CourseManagement;
