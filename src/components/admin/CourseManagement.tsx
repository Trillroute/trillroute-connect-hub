
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import CreateCourseDialog from './courses/CreateCourseDialog';
import ViewCourseDialog from './courses/ViewCourseDialog';
import EditCourseDialog from './courses/EditCourseDialog';
import DeleteCourseDialog from './courses/DeleteCourseDialog';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';
import { canManageCourses } from '@/utils/permissions';
import { supabase } from '@/integrations/supabase/client';
import ViewControls from './courses/ViewControls';
import CourseSearch from './courses/CourseSearch';
import CourseContent from './courses/CourseContent';

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
  const { user, isSuperAdmin } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { courses, loading, fetchCourses } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');

  console.log('CourseManagement rendering with courses:', courses?.length);
  console.log('Current user role:', user?.role);
  
  // Force superadmin to always have permissions
  const userCanEdit = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'edit'));
  const userCanDelete = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'delete'));
  const userCanAdd = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'add'));
  
  console.log('User can edit courses:', userCanEdit);
  console.log('User can delete courses:', userCanDelete);
  console.log('User can add courses:', userCanAdd);
  
  const effectiveCanEditCourse = canEditCourse && userCanEdit;
  const effectiveCanDeleteCourse = canDeleteCourse && userCanDelete;
  const effectiveCanAddCourse = canAddCourse && userCanAdd;
  
  const openViewDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const handleBulkDelete = async (courseIds: string[]) => {
    if (!effectiveCanDeleteCourse) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete courses.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .in('id', courseIds);
        
      if (error) {
        console.error('Error deleting courses:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete courses. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: "Courses Deleted",
        description: `Successfully deleted ${courseIds.length} course(s)`,
        duration: 3000,
      });
      
      // Refresh courses
      fetchCourses();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const filteredCourses = searchQuery 
    ? courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : courses;

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
          />
        </div>

        {effectiveCanAddCourse && (
          <CreateCourseDialog 
            open={isCreateDialogOpen} 
            onOpenChange={setIsCreateDialogOpen} 
            onSuccess={fetchCourses}
          />
        )}

        {selectedCourse && (
          <>
            <ViewCourseDialog
              isOpen={isViewDialogOpen}
              onOpenChange={setIsViewDialogOpen}
              course={selectedCourse}
              onSuccess={fetchCourses}
            />
            
            {effectiveCanEditCourse && (
              <EditCourseDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                course={selectedCourse}
                onSuccess={fetchCourses}
              />
            )}
            
            {effectiveCanDeleteCourse && (
              <DeleteCourseDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                course={selectedCourse}
                onSuccess={fetchCourses}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseManagement;
