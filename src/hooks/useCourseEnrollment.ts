
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export function useCourseEnrollment() {
  const [loading, setLoading] = useState(false);

  /**
   * Add a student to a course
   */
  const addStudentToCourse = async (courseId: string, studentId: string, teacherId?: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Get current course data
      const { data: courseData, error: fetchError } = await supabase
        .from('courses')
        .select('student_ids, students')
        .eq('id', courseId)
        .single();

      if (fetchError) {
        console.error('Error fetching course:', fetchError);
        toast.error('Failed to add student to course');
        return false;
      }

      const currentStudentIds = courseData.student_ids || [];
      
      // Check if student is already enrolled
      if (currentStudentIds.includes(studentId)) {
        toast.info('Student is already enrolled in this course');
        return true;
      }

      // Prepare enrollment metadata
      const enrollmentMetadata = {
        enrolled_at: new Date().toISOString(),
        enrolled_by: 'admin' // In a real app, you'd get this from the auth context
      };
      
      // If teacher is specified, add to metadata
      if (teacherId) {
        enrollmentMetadata['assigned_teacher_id'] = teacherId;
      }

      // Add student to course
      const newStudentIds = [...currentStudentIds, studentId];
      const newStudentCount = (courseData.students || 0) + 1;

      const { error: updateError } = await supabase
        .from('courses')
        .update({
          student_ids: newStudentIds,
          students: newStudentCount,
          // Store teacher assignments in metadata (optional)
          // This would allow tracking which teacher was assigned when enrolling
        })
        .eq('id', courseId);

      if (updateError) {
        console.error('Error updating course:', updateError);
        toast.error('Failed to add student to course');
        return false;
      }

      toast.success('Student added to course successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove a student from a course
   */
  const removeStudentFromCourse = async (courseId: string, studentId: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Get current course data
      const { data: courseData, error: fetchError } = await supabase
        .from('courses')
        .select('student_ids, students')
        .eq('id', courseId)
        .single();

      if (fetchError) {
        console.error('Error fetching course:', fetchError);
        toast.error('Failed to remove student from course');
        return false;
      }

      const currentStudentIds = courseData.student_ids || [];
      
      // Check if student is enrolled
      if (!currentStudentIds.includes(studentId)) {
        toast.info('Student is not enrolled in this course');
        return true;
      }

      // Remove student from course
      const newStudentIds = currentStudentIds.filter(id => id !== studentId);
      const newStudentCount = Math.max((courseData.students || 0) - 1, 0);

      const { error: updateError } = await supabase
        .from('courses')
        .update({
          student_ids: newStudentIds,
          students: newStudentCount
        })
        .eq('id', courseId);

      if (updateError) {
        console.error('Error updating course:', updateError);
        toast.error('Failed to remove student from course');
        return false;
      }

      toast.success('Student removed from course successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update course instructors
   */
  const updateCourseInstructors = async (courseId: string, instructorIds: string[]): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          instructor_ids: instructorIds
        })
        .eq('id', courseId);

      if (error) {
        console.error('Error updating course instructors:', error);
        toast.error('Failed to update course instructors');
        return false;
      }

      toast.success('Course instructors updated successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addStudentToCourse,
    removeStudentFromCourse,
    updateCourseInstructors
  };
}
