
import { supabase } from '@/integrations/supabase/client';
import { fetchEventsBySingleValue } from '@/services/events/api/queries/filter/fetchEventsBySingleValue';

export function useTrialVerification() {
  // Check if student has completed a trial for the specific course - improved version
  const hasCompletedTrialForCourse = async (studentId: string, courseId: string): Promise<boolean> => {
    try {
      console.log('Checking trial completion for student:', studentId, 'course:', courseId);
      
      // First check: Look in custom_users.trial_classes array (primary source of truth)
      const { data: studentData, error: studentError } = await supabase
        .from('custom_users')
        .select('trial_classes')
        .eq('id', studentId)
        .single();
      
      if (studentError) {
        console.error('Error checking student trial classes in custom_users:', studentError);
      } else if (studentData?.trial_classes && Array.isArray(studentData.trial_classes)) {
        const hasTrialInArray = studentData.trial_classes.includes(courseId);
        console.log('Trial classes in custom_users:', studentData.trial_classes);
        console.log('Course ID being checked:', courseId);
        console.log('Has trial in custom_users array:', hasTrialInArray);
        
        if (hasTrialInArray) {
          return true;
        }
      }
      
      // Second check: Look in user_events table for trial booking events (fallback)
      console.log('Checking user_events table for trial booking events...');
      const trialEvents = await fetchEventsBySingleValue('event_type', 'trial_booking');
      
      // Find trials for this specific student and course
      const studentTrialForCourse = trialEvents.find(event => {
        const metadata = event.metadata;
        if (typeof metadata === 'object' && metadata !== null) {
          const typedMetadata = metadata as any;
          const matchesStudent = typedMetadata.student_id === studentId;
          const matchesCourse = typedMetadata.course_id === courseId;
          console.log('Event metadata:', typedMetadata);
          console.log('Matches student:', matchesStudent, 'Matches course:', matchesCourse);
          return matchesStudent && matchesCourse;
        }
        return false;
      });

      const hasTrialEvent = !!studentTrialForCourse;
      console.log('Has trial event in user_events:', hasTrialEvent);

      // If we found a trial event but it's not in custom_users, sync the data
      if (hasTrialEvent && studentData) {
        console.log('Found trial event but not in custom_users - syncing data...');
        const currentTrialClasses = studentData.trial_classes || [];
        const updatedTrialClasses = [...currentTrialClasses, courseId];
        
        const { error: updateError } = await supabase
          .from('custom_users')
          .update({ trial_classes: updatedTrialClasses })
          .eq('id', studentId);
          
        if (updateError) {
          console.error('Error syncing trial classes to custom_users:', updateError);
        } else {
          console.log('Successfully synced trial classes to custom_users');
        }
      }

      return hasTrialEvent;
    } catch (error) {
      console.error('Error checking trial completion:', error);
      return false;
    }
  };

  return {
    hasCompletedTrialForCourse
  };
}
