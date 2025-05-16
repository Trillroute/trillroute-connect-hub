
import { useState } from 'react';
import { updateAllTeachersSkills, updateTeacherSkillsFromCourses } from '@/services/skills/teacherSkillUpdater';
import { useToast } from '@/hooks/use-toast';

export function useTeacherSkillUpdater() {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateAllTeachers = async () => {
    setUpdating(true);
    try {
      const updatedCount = await updateAllTeachersSkills();
      console.log(`Updated skills for ${updatedCount} teachers`);
      toast({
        title: "Teachers Skills Updated",
        description: `Successfully updated skills for ${updatedCount} teachers.`,
      });
      return updatedCount;
    } catch (error) {
      console.error('Error in useTeacherSkillUpdater:', error);
      toast({
        title: "Error",
        description: "Failed to update teacher skills. See console for details.",
        variant: "destructive",
      });
      return 0;
    } finally {
      setUpdating(false);
    }
  };

  const updateSingleTeacher = async (teacherId: string) => {
    setUpdating(true);
    try {
      const success = await updateTeacherSkillsFromCourses(teacherId);
      if (success) {
        toast({
          title: "Teacher Skills Updated",
          description: "Successfully updated skills for this teacher.",
        });
      } else {
        toast({
          title: "Warning",
          description: "Failed to update some teacher skills. See console for details.",
          variant: "destructive",
        });
      }
      return success;
    } catch (error) {
      console.error('Error updating single teacher:', error);
      toast({
        title: "Error",
        description: "Failed to update teacher skills. See console for details.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    updateAllTeachers,
    updateSingleTeacher
  };
}
