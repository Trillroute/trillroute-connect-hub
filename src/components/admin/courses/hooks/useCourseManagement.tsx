
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCourseToastAdapter } from './useCourseToastAdapter';
import { useAuth } from '@/hooks/useAuth';
import { Course } from '@/types/course';
import { deleteCourse } from '../courseService';
import { supabase } from '@/integrations/supabase/client';
import { formatClassTypesData } from '@/utils/courseHelpers';

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
  
  // Filter courses based on search query
  const getFilteredCourses = (query: string, courseList: Course[]) => {
    if (!query.trim()) return courseList;
    
    return courseList.filter(course => {
      const searchableText = `${course.title || ''} ${course.description || ''} ${course.level || ''} ${course.skill || ''}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
  };
  
  // Function to fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Parse class_types_data if necessary
      const parsedData = (data || []).map((course) => {
        // Creating a properly typed course object with class_types_data properly handled
        const courseWithProcessedData = {
          ...course,
          class_types_data: course.class_types_data ? 
            (typeof course.class_types_data === 'string' 
              ? JSON.parse(course.class_types_data) 
              : course.class_types_data)
        } as Course;
        
        return courseWithProcessedData;
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
  const handleBulkDelete = async (courseIds: string[], hasPermission: boolean) => {
    if (!hasPermission) {
      showErrorToast("You don't have permission to delete courses");
      return;
    }
    
    try {
      setLoading(true);
      await Promise.all(courseIds.map(id => deleteCourse(id)));
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
