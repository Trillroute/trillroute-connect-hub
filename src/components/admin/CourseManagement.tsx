import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, RefreshCw, LayoutGrid, Grid2x2, LayoutList, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CourseTable from './courses/CourseTable';
import CreateCourseDialog from './courses/CreateCourseDialog';
import ViewCourseDialog from './courses/ViewCourseDialog';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';
import { Input } from '@/components/ui/input';
import { canManageCourses } from '@/utils/adminPermissions';
import { supabase } from '@/integrations/supabase/client';

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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { courses, loading, fetchCourses } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');

  const userCanEdit = isSuperAdmin() || (user?.role === 'admin' && canManageCourses(user, 'edit'));
  const userCanDelete = isSuperAdmin() || (user?.role === 'admin' && canManageCourses(user, 'delete'));
  const userCanAdd = isSuperAdmin() || (user?.role === 'admin' && canManageCourses(user, 'add'));
  
  const effectiveCanEditCourse = canEditCourse && userCanEdit;
  const effectiveCanDeleteCourse = canDeleteCourse && userCanDelete;
  const effectiveCanAddCourse = canAddCourse && userCanAdd;
  
  if (user?.role === 'admin') {
    console.log('CourseManagement - can edit courses permission:', canManageCourses(user, 'edit'));
  }
  
  const openViewDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsViewDialogOpen(true);
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
          <div className="flex space-x-2 items-center">
            <Button 
              size="sm" 
              variant={viewMode === 'list' ? "secondary" : "outline"}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'grid' ? "secondary" : "outline"}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'tile' ? "secondary" : "outline"}
              onClick={() => setViewMode('tile')}
              title="Tile view"
            >
              <Grid2x2 className="w-4 h-4" />
            </Button>
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
        <div className="relative w-full mb-4">
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

        <div className="relative">
          {viewMode === 'list' && (
            <CourseTable 
              courses={filteredCourses} 
              loading={loading} 
              onView={openViewDialog}
              onBulkDelete={handleBulkDelete}
            />
          )}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-muted rounded-lg shadow p-4 flex flex-col">
                  <div className="flex items-center gap-3">
                    {course.image && (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-10 w-10 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{course.title}</div>
                      <div className="text-xs text-gray-500">{course.level} • {course.skill}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openViewDialog(course)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {viewMode === 'tile' && (
            <div className="flex flex-wrap gap-4">
              {filteredCourses.map(course => (
                <div key={course.id} className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center">
                  {course.image && (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-10 w-10 rounded object-cover flex-shrink-0 mb-2"
                    />
                  )}
                  <div className="font-semibold">{course.title}</div>
                  <div className="text-xs text-gray-500">{course.level} • {course.skill}</div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openViewDialog(course)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {effectiveCanAddCourse && (
          <CreateCourseDialog 
            open={isCreateDialogOpen} 
            onOpenChange={setIsCreateDialogOpen} 
            onSuccess={fetchCourses}
          />
        )}

        {selectedCourse && (
          <ViewCourseDialog
            isOpen={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            course={selectedCourse}
            onSuccess={fetchCourses}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CourseManagement;
