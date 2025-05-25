
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Adds random trial classes to students for testing purposes
 */
export const addRandomTrialClasses = async () => {
  try {
    // Get all students
    const { data: students, error: studentsError } = await supabase
      .from('custom_users')
      .select('id, first_name, last_name')
      .eq('role', 'student');

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      return false;
    }

    // Get all courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title');

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return false;
    }

    if (!students || !courses || students.length === 0 || courses.length === 0) {
      console.log('No students or courses found');
      return false;
    }

    const trialEvents = [];

    // For each student, randomly assign 1-3 trial classes
    for (const student of students) {
      const numTrials = Math.floor(Math.random() * 3) + 1; // 1-3 trials
      const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < Math.min(numTrials, courses.length); i++) {
        const course = shuffledCourses[i];
        const trialDate = new Date();
        trialDate.setDate(trialDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days
        
        const trialEvent = {
          id: uuidv4(),
          user_id: student.id,
          event_type: 'trial_booking',
          title: `Trial Class - ${course.title}`,
          description: `Trial class for ${student.first_name} ${student.last_name}`,
          start_time: trialDate.toISOString(),
          end_time: new Date(trialDate.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
          metadata: {
            student_id: student.id,
            course_id: course.id,
            course_title: course.title,
            trial_completed: true,
            booking_time: new Date().toISOString()
          }
        };
        
        trialEvents.push(trialEvent);
      }
    }

    // Insert all trial events
    const { error: insertError } = await supabase
      .from('user_events')
      .insert(trialEvents);

    if (insertError) {
      console.error('Error inserting trial events:', insertError);
      return false;
    }

    console.log(`Successfully added ${trialEvents.length} trial classes for ${students.length} students`);
    return true;
  } catch (error) {
    console.error('Error in addRandomTrialClasses:', error);
    return false;
  }
};

/**
 * Admin function to clear all trial classes (for testing)
 */
export const clearAllTrialClasses = async () => {
  try {
    const { error } = await supabase
      .from('user_events')
      .delete()
      .eq('event_type', 'trial_booking');

    if (error) {
      console.error('Error clearing trial classes:', error);
      return false;
    }

    console.log('All trial classes cleared');
    return true;
  } catch (error) {
    console.error('Error in clearAllTrialClasses:', error);
    return false;
  }
};
