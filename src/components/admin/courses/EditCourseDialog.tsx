
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/types/course';
import { useTeachers } from '@/hooks/useTeachers';
import { useSkills } from '@/hooks/useSkills';
import { useAuth } from '@/hooks/useAuth';
import { canManageCourses } from '@/utils/adminPermissions';
import EditCourseDialogContent from './dialogs/EditCourseDialogContent';
import { useEditCourseForm } from './dialogs/useEditCourseForm';
import { useEditCourseSubmission } from './dialogs/useEditCourseSubmission';

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onSuccess: () => void;
}

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({ 
  open, 
  onOpenChange, 
  course, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const { teachers = [] } = useTeachers();
  const { skills = [] } = useSkills();
  const { user, isSuperAdmin } = useAuth();
  
  const hasEditPermission = isSuperAdmin() || 
    (user?.role === 'admin' && canManageCourses(user, 'edit'));

  console.log('EditCourseDialog - User:', user);
  console.log('EditCourseDialog - User role:', user?.role);
  console.log('EditCourseDialog - Is superadmin?', isSuperAdmin());
  console.log('EditCourseDialog - hasEditPermission:', hasEditPermission);
  console.log('EditCourseDialog - admin role name:', user?.adminRoleName);

  useEffect(() => {
    if (open && !hasEditPermission) {
      console.log('EditCourseDialog - Permission denied, closing dialog');
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit courses.",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  }, [open, hasEditPermission, onOpenChange, toast]);

  const form = useEditCourseForm(course, open);
  const { isLoading, handleUpdateCourse } = useEditCourseSubmission(
    course,
    onSuccess,
    () => onOpenChange(false),
    hasEditPermission
  );

  return (
    <Dialog open={open && hasEditPermission} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <EditCourseDialogContent
          form={form}
          onSubmit={handleUpdateCourse}
          teachers={teachers}
          skills={skills}
          isLoading={isLoading}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
