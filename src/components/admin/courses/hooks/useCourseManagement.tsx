import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCourseToastAdapter } from './useCourseToastAdapter';
import { useAuth } from '@/hooks/useAuth';
import { Course, ClassTypeData } from '@/types/course';
import { supabase } from '@/integrations/supabase/client';
import { deleteCourse } from '../courseService';

export const useCourseManagement = () => {
  const { toast } = useToast();
  const { showSuccessToast, showErrorToast } = useCourseToastAdapter();
  const { isSuperAdmin, isAdmin } = useAuth();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Helper function to process class_types_data
  const processClassTypesData = (data: any): ClassTypeData[] => {
    if (!data) return [];
    
    if (typeof data === 'string') {
      try {
        return JSON.parse(data) as ClassTypeData[];
      } catch (e) {
        console.error('Error parsing class_types_data:', e);
        return [];
      }
    }
    
    return data as ClassTypeData[];
  };
  
  // Filter courses based on search query
  const getFilteredCourses = (query: string, courseList: Course[]): Course[] => {
    if (!query.trim()) return courseList;
    
    return courseList.filter(course => {
      const searchableText = `${course.title || ''} ${course.description || ''} ${course.level || ''} ${course.skill || ''}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
  };
  
  // Function to fetch courses
  const fetchCourses = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Parse class_types_data if necessary
      const parsedData = (data || []).map((course): Course => {
        return {
          ...course,
          class_types_data: processClassTypesData(course.class_types_data)
        };
      });
      
      setCourses(parsedData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showErrorToast("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };
  
  // Dialog handlers
  const openViewDialog = (course: Course): void => {
    setSelectedCourse(course);
    setIsViewDialogOpen(true);
  };
  
  const openEditDialog = (course: Course): void => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (course: Course): void => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };
  
  // Permission checking
  const getEffectivePermissions = (canEdit: boolean, canDelete: boolean, canAdd: boolean) => {
    const isSuperAdminUser = isSuperAdmin();
    
    return {
      effectiveCanEditCourse: isSuperAdminUser ? true : canEdit,
      effectiveCanDeleteCourse: isSuperAdminUser ? true : canDelete,
      effectiveCanAddCourse: isSuperAdminUser ? true : canAdd
    };
  };
  
  // Bulk delete handler
  const handleBulkDelete = async (courseIds: string[], hasPermission: boolean): Promise<void> => {
    if (!hasPermission) {
      showErrorToast("You don't have permission to delete courses");
      return;
    }
    
    try {
      setLoading(true);
      
      for (const id of courseIds) {
        await deleteCourse(id);
      }
      
      showSuccessToast(`Successfully deleted ${courseIds.length} courses`);
      await fetchCourses();
    } catch (error) {
      showErrorToast("Failed to delete some courses");
      console.error("Error during bulk delete:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  return {
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
  };
};
