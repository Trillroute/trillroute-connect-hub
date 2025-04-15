
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import CourseTable from './courses/CourseTable';
import CreateCourseDialog from './courses/CreateCourseDialog';
import EditCourseDialog from './courses/EditCourseDialog';
import DeleteCourseDialog from './courses/DeleteCourseDialog';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';

const CourseManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { courses, loading, fetchCourses } = useCourses();
  
  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Course Management</CardTitle>
        <Button 
          className="bg-music-500 hover:bg-music-600" 
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </CardHeader>
      <CardContent>
        <CourseTable 
          courses={courses} 
          loading={loading} 
          onEdit={openEditDialog} 
          onDelete={openDeleteDialog}
        />
      </CardContent>

      <CreateCourseDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSuccess={fetchCourses}
      />

      {selectedCourse && (
        <>
          <EditCourseDialog 
            open={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen} 
            course={selectedCourse}
            onSuccess={fetchCourses}
          />
          
          <DeleteCourseDialog 
            open={isDeleteDialogOpen} 
            onOpenChange={setIsDeleteDialogOpen} 
            course={selectedCourse}
            onSuccess={fetchCourses}
          />
        </>
      )}
    </Card>
  );
};

export default CourseManagement;
