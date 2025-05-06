
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCourseToastAdapter } from './useCourseToastAdapter';
import { useAuth } from '@/hooks/useAuth';
import { fetchCourses, deleteCourse } from '../courseService';

export const useCourseManagement = () => {
  const { toast } = useToast();
  const { showSuccessToast, showErrorToast } = useCourseToastAdapter();
  const { isSuperAdmin, isAdmin } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Function to fetch courses with error handling
  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchCourses();
      setCourses(data);
    } catch (error) {
      showErrorToast("Failed to load courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);
  
  // Filter courses based on search query
  const getFilteredCourses = (query, courseList) => {
    if (!query.trim()) return courseList;
    
    return courseList.filter(course => {
      const searchableText = `${course.name} ${course.description} ${course.level || ''} ${course.instrument || ''}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
  };
  
  // Dialog handlers
  const openViewDialog = (course) => {
    setSelectedCourse(course);
    setIsViewDialogOpen(true);
  };
  
  const openEditDialog = (course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };
  
  // Permission checking
  const getEffectivePermissions = (canEdit, canDelete, canAdd) => {
    const isSuperAdminUser = isSuperAdmin();
    
    return {
      effectiveCanEditCourse: isSuperAdminUser ? true : canEdit,
      effectiveCanDeleteCourse: isSuperAdminUser ? true : canDelete,
      effectiveCanAddCourse: isSuperAdminUser ? true : canAdd
    };
  };
  
  // Bulk delete handler
  const handleBulkDelete = async (courseIds, hasPermission) => {
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
      await loadCourses();
    } catch (error) {
      showErrorToast("Failed to delete some courses");
      console.error("Error during bulk delete:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    isCreateDialogOpen, setIsCreateDialogOpen,
    isViewDialogOpen, setIsViewDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    isDeleteDialogOpen, setIsDeleteDialogOpen,
    selectedCourse, courses, loading, fetchCourses: loadCourses,
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
