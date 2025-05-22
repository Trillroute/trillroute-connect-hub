
import { useState } from 'react';
import { Course } from '@/types/course';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCourseDialogs = (
  fetchCourses: () => void,
  effectiveCanDeleteCourse: boolean
) => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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

  return {
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
  };
};
