
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, RefreshCw, Filter, ArrowUpDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import CourseTable from './courses/CourseTable';
import CreateCourseDialog from './courses/CreateCourseDialog';
import EditCourseDialog from './courses/EditCourseDialog';
import DeleteCourseDialog from './courses/DeleteCourseDialog';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';
import { Input } from '@/components/ui/input';

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
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { courses, loading, fetchCourses } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Check if the user is a superadmin and override permissions
  const isSuperAdmin = user?.role === 'superadmin';
  const effectiveCanEditCourse = isSuperAdmin ? true : canEditCourse;
  const effectiveCanDeleteCourse = isSuperAdmin ? true : canDeleteCourse;
  const effectiveCanAddCourse = isSuperAdmin ? true : canAddCourse;
  
  const openEditDialog = (course: Course) => {
    // Always allow superadmin to edit courses
    if (isSuperAdmin) {
      setSelectedCourse(course);
      setIsEditDialogOpen(true);
      return;
    }
    
    // Only allow opening the edit dialog if the user has edit permissions
    if (!effectiveCanEditCourse) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit courses.",
        variant: "destructive",
      });
      return;
    }
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (course: Course) => {
    // Always allow superadmin to delete courses
    if (isSuperAdmin) {
      setSelectedCourse(course);
      setIsDeleteDialogOpen(true);
      return;
    }
    
    // Only allow opening the delete dialog if the user has delete permissions
    if (!effectiveCanDeleteCourse) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete courses.",
        variant: "destructive",
      });
      return;
    }
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>Manage courses and lessons</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={fetchCourses}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {effectiveCanAddCourse && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-auto flex-1">
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" /> 
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" /> 
              Sort
            </Button>
          </div>
        </div>

        <CourseTable 
          courses={courses} 
          loading={loading} 
          // Use the effective permissions based on superadmin status
          onEdit={openEditDialog} 
          onDelete={effectiveCanDeleteCourse ? openDeleteDialog : undefined}
        />
      </CardContent>

      {effectiveCanAddCourse && (
        <CreateCourseDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
          onSuccess={fetchCourses}
        />
      )}

      {selectedCourse && (
        <>
          <EditCourseDialog 
            open={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen} 
            course={selectedCourse}
            onSuccess={fetchCourses}
          />
          
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
    </Card>
  );
};

export default CourseManagement;
