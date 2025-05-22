
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTeachers } from '@/hooks/useTeachers';
import { useSkills } from '@/hooks/useSkills';
import { useAuth } from '@/hooks/useAuth';
import { canManageCourses } from '@/utils/adminPermissions';
import CourseDialogHeader from './CourseDialogHeader';
import CourseFormContent from './CourseFormContent';
import { useCourseFormSubmission } from './useCourseFormSubmission';

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateCourseDialog: React.FC<CreateCourseDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const { teachers = [] } = useTeachers();
  const { skills = [] } = useSkills();
  const { user, isSuperAdmin } = useAuth();

  const hasAddPermission = isSuperAdmin() ||
    (user?.role === 'admin' && canManageCourses(user, 'add'));

  const { form, isLoading, handleCreateCourse } = useCourseFormSubmission(onSuccess, onOpenChange);

  useEffect(() => {
    if (open && !hasAddPermission) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add courses.",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  }, [open, hasAddPermission, onOpenChange, toast]);

  return (
    <Dialog open={open && hasAddPermission} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <CourseDialogHeader title="Create New Course" />
        <CourseFormContent
          form={form}
          onSubmit={handleCreateCourse}
          teachers={teachers}
          skills={skills}
          isLoading={isLoading}
          cancelAction={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;
