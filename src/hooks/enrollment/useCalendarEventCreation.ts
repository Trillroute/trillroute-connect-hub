
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export interface CalendarEventData {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  user_id: string;
  location?: string;
  color?: string;
}

export function useCalendarEventCreation() {
  
  // Helper function to calculate event duration based on class types data
  const calculateEventDuration = async (courseId: string) => {
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select('class_types_data')
        .eq('id', courseId)
        .single();

      if (error || !course) {
        console.log('Could not fetch course class types, using default duration');
        return 60; // Default 60 minutes
      }

      const classTypesData = course.class_types_data;
      
      if (!Array.isArray(classTypesData) || classTypesData.length === 0) {
        console.log('No class types data found, using default duration');
        return 60;
      }

      const firstClassType = classTypesData[0];
      
      if (!firstClassType || typeof firstClassType !== 'object' || !('class_type_id' in firstClassType)) {
        console.log('Invalid class type data structure, using default duration');
        return 60;
      }

      const classTypeId = String(firstClassType.class_type_id);

      const { data: classType, error: classTypeError } = await supabase
        .from('class_types')
        .select('duration_value, duration_metric')
        .eq('id', classTypeId)
        .single();

      if (classTypeError || !classType) {
        console.log('Could not fetch class type details, using default duration');
        return 60;
      }

      const { duration_value, duration_metric } = classType;
      let durationInMinutes = duration_value || 60;

      switch (duration_metric) {
        case 'hours':
          durationInMinutes = duration_value * 60;
          break;
        case 'days':
          durationInMinutes = duration_value * 24 * 60;
          break;
        case 'weeks':
          durationInMinutes = duration_value * 7 * 24 * 60;
          break;
        case 'months':
          durationInMinutes = duration_value * 30 * 24 * 60;
          break;
        default:
          durationInMinutes = duration_value;
      }

      console.log(`Calculated event duration: ${durationInMinutes} minutes for course ${courseId}`);
      return durationInMinutes;
    } catch (error) {
      console.error('Error calculating event duration:', error);
      return 60;
    }
  };

  // Create calendar events for recurring courses
  const createRecurringEvents = async (
    courseId: string,
    studentId: string,
    teacherId: string,
    availabilitySlotData?: any,
    courseData?: any
  ) => {
    try {
      console.log('Creating recurring events for enrollment:', { courseId, studentId, teacherId, availabilitySlotData });
      
      if (!availabilitySlotData?.availabilitySlotId || 
          availabilitySlotData.dayOfWeek === undefined || 
          !availabilitySlotData.startTime || 
          !availabilitySlotData.endTime) {
        console.error('Invalid availability slot data provided for recurring course');
        return false;
      }

      // Get event duration from class types
      const eventDurationMinutes = await calculateEventDuration(courseId);

      // Get course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('title, duration, course_type, skill, level')
        .eq('id', courseId)
        .single();

      if (courseError || !course) {
        console.error('Error fetching course details:', courseError);
        return false;
      }

      // Get teacher details
      const { data: teacher, error: teacherError } = await supabase
        .from('custom_users')
        .select('first_name, last_name')
        .eq('id', teacherId)
        .single();

      if (teacherError || !teacher) {
        console.error('Error fetching teacher details:', teacherError);
        return false;
      }

      // Get student details
      const { data: student, error: studentError } = await supabase
        .from('custom_users')
        .select('first_name, last_name')
        .eq('id', studentId)
        .single();

      if (studentError || !student) {
        console.error('Error fetching student details:', studentError);
        return false;
      }

      // Create events for the next 4 sessions
      const eventsToCreate = [];
      const sessionsToCreate = 4;
      
      console.log(`Creating ${sessionsToCreate} events with duration ${eventDurationMinutes} minutes`);
      
      // Parse the start time from the availability slot
      const [startHour, startMinute] = availabilitySlotData.startTime.split(':').map(Number);
      
      for (let sessionIndex = 0; sessionIndex < sessionsToCreate; sessionIndex++) {
        // Calculate the date for this session - find the next occurrence of the target day
        const today = new Date();
        const targetDayOfWeek = availabilitySlotData.dayOfWeek;
        
        // Calculate days until the target day for this session
        let daysUntilTarget = (targetDayOfWeek - today.getDay() + 7) % 7;
        if (daysUntilTarget === 0 && today.getHours() > startHour) {
          daysUntilTarget = 7; // Move to next week if today but time has passed
        }
        
        // Add weeks for subsequent sessions
        const totalDaysFromToday = daysUntilTarget + (sessionIndex * 7);
        
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() + totalDaysFromToday);
        
        // Create the exact start time for this session
        const startTime = new Date(sessionDate);
        startTime.setHours(startHour, startMinute, 0, 0);
        
        // Calculate end time based on CLASS duration (not slot duration)
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + eventDurationMinutes);

        console.log(`Session ${sessionIndex + 1}: ${startTime.toISOString()} to ${endTime.toISOString()}`);

        // Create event for teacher
        const teacherEvent = {
          id: uuidv4(),
          user_id: teacherId,
          event_type: 'class',
          title: `${course.title} - ${student.first_name} ${student.last_name}`,
          description: `${course.course_type} ${course.skill} class (${course.level}) with student ${student.first_name} ${student.last_name}`,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          metadata: {
            courseId,
            studentId,
            teacherId,
            courseType: course.course_type,
            courseTitle: course.title,
            courseSkill: course.skill,
            courseLevel: course.level,
            studentName: `${student.first_name} ${student.last_name}`,
            teacherName: `${teacher.first_name} ${teacher.last_name}`,
            isAutoGenerated: true,
            sessionNumber: sessionIndex + 1,
            totalSessions: sessionsToCreate,
            durationMinutes: eventDurationMinutes,
            replacesAvailabilitySlot: availabilitySlotData.availabilitySlotId,
            originalSlotTime: `${availabilitySlotData.startTime}-${availabilitySlotData.endTime}`,
            dayOfWeek: availabilitySlotData.dayOfWeek
          }
        };

        // Create event for student
        const studentEvent = {
          id: uuidv4(),
          user_id: studentId,
          event_type: 'class',
          title: `${course.title} - with ${teacher.first_name} ${teacher.last_name}`,
          description: `${course.course_type} ${course.skill} class (${course.level}) with teacher ${teacher.first_name} ${teacher.last_name}`,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          metadata: {
            courseId,
            studentId,
            teacherId,
            courseType: course.course_type,
            courseTitle: course.title,
            courseSkill: course.skill,
            courseLevel: course.level,
            studentName: `${student.first_name} ${student.last_name}`,
            teacherName: `${teacher.first_name} ${teacher.last_name}`,
            isAutoGenerated: true,
            sessionNumber: sessionIndex + 1,
            totalSessions: sessionsToCreate,
            durationMinutes: eventDurationMinutes,
            replacesAvailabilitySlot: availabilitySlotData.availabilitySlotId,
            originalSlotTime: `${availabilitySlotData.startTime}-${availabilitySlotData.endTime}`,
            dayOfWeek: availabilitySlotData.dayOfWeek
          }
        };

        eventsToCreate.push(teacherEvent, studentEvent);
      }

      console.log(`About to insert ${eventsToCreate.length} events`);

      // Insert all events in a single transaction
      const { error: insertError } = await supabase
        .from('user_events')
        .insert(eventsToCreate);

      if (insertError) {
        console.error('Error creating calendar events:', insertError);
        return false;
      }

      console.log(`Successfully created ${eventsToCreate.length} calendar events for recurring enrollment`);
      return true;

    } catch (error) {
      console.error('Error in createRecurringEvents:', error);
      return false;
    }
  };

  // Create calendar events for one-time courses
  const createOneTimeEvents = async (
    courseId: string,
    studentId: string,
    teacherId?: string,
    courseData?: any
  ) => {
    try {
      console.log('Creating one-time events for enrollment:', { courseId, studentId, teacherId });

      // Get event duration from class types
      const eventDurationMinutes = await calculateEventDuration(courseId);

      // Get course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('title, duration, course_type, instructor_ids')
        .eq('id', courseId)
        .single();

      if (courseError || !course) {
        console.error('Error fetching course details:', courseError);
        return false;
      }

      // For group courses, use the first instructor if no specific teacher provided
      const effectiveTeacherId = teacherId || (course.instructor_ids && course.instructor_ids[0]);
      
      if (!effectiveTeacherId) {
        console.log('No teacher available for one-time course');
        return false;
      }

      // Get teacher details
      const { data: teacher, error: teacherError } = await supabase
        .from('custom_users')
        .select('first_name, last_name')
        .eq('id', effectiveTeacherId)
        .single();

      if (teacherError || !teacher) {
        console.error('Error fetching teacher details:', teacherError);
        return false;
      }

      // Get student details
      const { data: student, error: studentError } = await supabase
        .from('custom_users')
        .select('first_name, last_name')
        .eq('id', studentId)
        .single();

      if (studentError || !student) {
        console.error('Error fetching student details:', studentError);
        return false;
      }

      // For one-time courses, create a placeholder event for next week
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + 7);
      eventDate.setHours(14, 0, 0, 0);

      // Calculate end time based on class duration
      const endTime = new Date(eventDate);
      endTime.setMinutes(endTime.getMinutes() + eventDurationMinutes);

      const eventsToCreate = [];

      console.log(`Creating one-time event with duration: ${eventDurationMinutes} minutes`);

      // Create event for teacher
      const teacherEvent = {
        id: uuidv4(),
        user_id: effectiveTeacherId,
        event_type: 'class',
        title: `${course.title} - ${student.first_name} ${student.last_name}`,
        description: `${course.course_type} class with student ${student.first_name} ${student.last_name}`,
        start_time: eventDate.toISOString(),
        end_time: endTime.toISOString(),
        metadata: {
          courseId,
          studentId,
          teacherId: effectiveTeacherId,
          courseType: course.course_type,
          courseTitle: course.title,
          isAutoGenerated: true,
          isOneTime: true,
          durationMinutes: eventDurationMinutes
        }
      };

      // Create event for student
      const studentEvent = {
        id: uuidv4(),
        user_id: studentId,
        event_type: 'class',
        title: `${course.title} - with ${teacher.first_name} ${teacher.last_name}`,
        description: `${course.course_type} class with teacher ${teacher.first_name} ${teacher.last_name}`,
        start_time: eventDate.toISOString(),
        end_time: endTime.toISOString(),
        metadata: {
          courseId,
          studentId,
          teacherId: effectiveTeacherId,
          courseType: course.course_type,
          courseTitle: course.title,
          isAutoGenerated: true,
          isOneTime: true,
          durationMinutes: eventDurationMinutes
        }
      };

      eventsToCreate.push(teacherEvent, studentEvent);

      console.log('About to insert', eventsToCreate.length, 'one-time events');

      // Insert events
      const { error: insertError } = await supabase
        .from('user_events')
        .insert(eventsToCreate);

      if (insertError) {
        console.error('Error creating calendar events:', insertError);
        return false;
      }

      console.log(`Successfully created ${eventsToCreate.length} calendar events for one-time enrollment`);
      return true;

    } catch (error) {
      console.error('Error in createOneTimeEvents:', error);
      return false;
    }
  };

  return {
    createRecurringEvents,
    createOneTimeEvents
  };
}
