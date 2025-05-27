
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useTrialBooking() {
  const [loading, setLoading] = useState(false);

  // Book a trial class for a student
  const bookTrialClass = async (
    courseId: string, 
    studentId: string,
    teacherId?: string,
    additionalMetadata?: Record<string, any>
  ) => {
    if (!courseId || !studentId) return false;
    
    setLoading(true);
    try {
      // First, get the course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('title, course_type, duration_type, instructor_ids')
        .eq('id', courseId)
        .single();
      
      if (courseError) {
        console.error('Error fetching course data:', courseError);
        toast.error('Failed to fetch course data');
        setLoading(false);
        return false;
      }
      
      // Check if student already has a trial for this course by checking custom_users.trial_classes
      const { data: studentData, error: studentError } = await supabase
        .from('custom_users')
        .select('trial_classes')
        .eq('id', studentId)
        .single();
      
      if (studentError) {
        console.error('Error checking student trial classes:', studentError);
        toast.error('Failed to check existing trial classes');
        setLoading(false);
        return false;
      }
      
      const currentTrialClasses = studentData?.trial_classes || [];
      if (currentTrialClasses.includes(courseId)) {
        toast.info('Student already has a trial class for this course');
        setLoading(false);
        return true;
      }
      
      // Create the trial booking metadata
      const metadata = {
        student_id: studentId,
        course_id: courseId,
        course_title: courseData.title,
        course_type: courseData.course_type,
        booking_date: new Date().toISOString(),
        booking_type: 'trial',
        ...(teacherId && { teacher_id: teacherId }),
        ...(additionalMetadata || {})
      };
      
      // Create a trial booking event
      const { error: trialError } = await supabase
        .from('user_events')
        .insert({
          id: uuidv4(),
          user_id: studentId,
          event_type: 'trial_booking',
          title: `Trial Class - ${courseData.title}`,
          description: `Trial class booking${teacherId ? ` with teacher ID: ${teacherId}` : ''}`,
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          metadata
        });
        
      if (trialError) {
        console.error('Error creating trial booking:', trialError);
        toast.error('Failed to book trial class');
        setLoading(false);
        return false;
      }

      // Update the student's trial_classes array in custom_users
      const updatedTrialClasses = [...currentTrialClasses, courseId];
      const { error: updateError } = await supabase
        .from('custom_users')
        .update({ trial_classes: updatedTrialClasses })
        .eq('id', studentId);

      if (updateError) {
        console.error('Error updating student trial classes:', updateError);
        // Don't fail the entire operation for this, just log the error
        console.warn('Trial booking created but failed to update student trial_classes array');
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Trial booking error:', error);
      toast.error('An error occurred during trial booking');
      setLoading(false);
      return false;
    }
  };

  return {
    bookTrialClass,
    loading
  };
}
