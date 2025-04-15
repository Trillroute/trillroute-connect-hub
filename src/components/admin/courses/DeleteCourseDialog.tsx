
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';
import { useAuth } from '@/hooks/useAuth';

interface DeleteCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onSuccess: () => void;
}

const DeleteCourseDialog: React.FC<DeleteCourseDialogProps> = ({ open, onOpenChange, course, onSuccess }) => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  const handleDeleteCourse = async () => {
    try {
      // Check if user is admin
      if (!isAdmin()) {
        toast({
          title: 'Permission Denied',
          description: 'Only administrators can delete courses.',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id);
        
      if (error) {
        console.error('Error deleting course:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete course. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      onOpenChange(false);
      onSuccess();
      
      toast({
        title: "Course Deleted",
        description: `${course.title} has been successfully deleted`,
        variant: "destructive",
        duration: 3000,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Course</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this course? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="font-medium">{course.title}</p>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDeleteCourse}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseDialog;
