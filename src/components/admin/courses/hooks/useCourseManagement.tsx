import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';
import { canManageCourses } from '@/utils/permissions';
import { supabase } from '@/integrations/supabase/client';
import { useCourseToastAdapter } from './useCourseToastAdapter';

export function useCourseManagement() {
  const { toast } = useToast();
  const { showToast } = useCourseToastAdapter();
  const { user, isSuperAdmin } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { courses, loading, fetchCourses } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');

  // Force superadmin to always have permissions
  const userCanEdit = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'edit'));
  const userCanDelete = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'delete'));
  const userCanAdd = user?.role === 'superadmin' || (user?.role === 'admin' && canManageCourses(user, 'add'));

  const getEffectivePermissions = (canEditCourse = true, canDeleteCourse = true, canAddCourse = true) => {
    return {
      effectiveCanEditCourse: canEditCourse && userCanEdit,
      effectiveCanDeleteCourse: canDeleteCourse && userCanDelete,
      effectiveCanAddCourse: canAddCourse && userCanAdd
    };
  };

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

  const handleBulkDelete = async (courseIds: string[], canDelete: boolean) => {
    if (!canDelete) {
      showToast("Permission Denied", "You don't have permission to delete courses.", "destructive");
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
      
      showToast("Courses Deleted", `Successfully deleted ${courseIds.length} course(s)`);
      
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

  const getFilteredCourses = (query: string, courseList: Course[]) => {
    if (!query) return courseList;
    
    return courseList.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase()) ||
      course.level.toLowerCase().includes(query.toLowerCase()) ||
      course.skill.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    // State
    isCreateDialogOpen, setIsCreateDialogOpen,
    isViewDialogOpen, setIsViewDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    isDeleteDialogOpen, setIsDeleteDialogOpen,
    selectedCourse, setSelectedCourse,
    courses, loading, fetchCourses,
    searchQuery, setSearchQuery,
    viewMode, setViewMode,
    // Functions
    getEffectivePermissions,
    openViewDialog,
    openEditDialog,
    openDeleteDialog,
    handleBulkDelete,
    getFilteredCourses
  };
}
