
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
      
      // Check if classTypesData is an array and has elements
      if (!Array.isArray(classTypesData) || classTypesData.length === 0) {
        console.log('No class types data found, using default duration');
        return 60; // Default 60 minutes
      }

      // Get the first class type's duration
      const firstClassType = classTypesData[0];
      
      if (!firstClassType || typeof firstClassType !== 'object' || !('class_type_id' in firstClassType)) {
        console.log('Invalid class type data structure, using default duration');
        return 60;
      }

      // Safely convert class_type_id to string
      const classTypeId = String(firstClassType.class_type_id);

      const { data: classType, error: classTypeError } = await supabase
        .from('class_types')
        .select('duration_value, duration_metric')
        .eq('id', classTypeId)
        .single();

      if (classTypeError || !classType) {
        console.log('Could not fetch class type details, using default duration');
        return 60; // Default 60 minutes
      }

      // Convert duration to minutes
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
        default: // 'minutes' or unknown
          durationInMinutes = duration_value;
      }

      console.log(`Calculated event duration: ${durationInMinutes} minutes for course ${courseId}`);
      return durationInMinutes;
    } catch (error) {
      console.error('Error calculating event duration:', error);
      return 60; // Default fallback
    }
  };

  // Create calendar events for recurring courses
  const createRecurringEvents = async (
    courseId: string,
    studentId: string,
    teacherId: string,
    additionalMetadata?: any,
    courseData?: any
  ) => {
    try {
      console.log('Creating recurring events for enrollment:', { courseId, studentId, teacherId });
      console.log('Additional metadata provided:', additionalMetadata);
      
      // Extract availability slot data from additionalMetadata
      const availabilitySlot = {
        dayOfWeek: additionalMetadata?.dayOfWeek,
        startTime: additionalMetadata?.startTime,
        endTime: additionalMetadata?.endTime,
        availabilitySlotId: additionalMetadata?.availabilitySlotId
      };
      
      console.log('Extracted availability slot:', availabilitySlot);
      
      if ((availabilitySlot.dayOfWeek !== 0 && !availabilitySlot.dayOfWeek) || !availabilitySlot.startTime || !availabilitySlot.endTime) {
        console.log('Invalid availability slot provided for recurring course');
        console.log('Missing required fields:', {
          dayOfWeek: availabilitySlot.dayOfWeek,
          startTime: availabilitySlot.startTime,
          endTime: availabilitySlot.endTime
        });
        return false;
      }

      // Get event duration from class types (this is the actual class duration)
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

      // Calculate events for the next 12 weeks (3 months)
      const eventsToCreate = [];
      const startDate = new Date();
      const weeksToCreate = 12;
      
      console.log('Creating events for next', weeksToCreate, 'weeks with duration', eventDurationMinutes, 'minutes');
      console.log('Availability slot details:', availabilitySlot);
      
      for (let week = 0; week < weeksToCreate; week++) {
        // Calculate the next occurrence of the selected day
        const today = new Date();
        const targetDay = availabilitySlot.dayOfWeek;
        const daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
        const firstOccurrence = new Date(today);
        firstOccurrence.setDate(today.getDate() + daysUntilTarget + (week * 7));
        
        // Parse the start time from the availability slot
        const [startHour, startMinute] = availabilitySlot.startTime.split(':').map(Number);
        
        // Create the exact start time for this class
        const startTime = new Date(firstOccurrence);
        startTime.setHours(startHour, startMinute, 0, 0);
        
        // Calculate end time based on CLASS duration (not slot duration)
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + eventDurationMinutes);

        console.log(`Creating event for week ${week + 1}: ${startTime.toISOString()} to ${endTime.toISOString()}`);

        // Create event for teacher with comprehensive metadata
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
            durationMinutes: eventDurationMinutes,
            replacesAvailabilitySlot: availabilitySlot.availabilitySlotId,
            originalSlotTime: `${availabilitySlot.startTime}-${availabilitySlot.endTime}`,
            dayOfWeek: availabilitySlot.dayOfWeek
          }
        };

        // Create event for student with comprehensive metadata
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
            durationMinutes: eventDurationMinutes,
            replacesAvailabilitySlot: availabilitySlot.availabilitySlotId,
            originalSlotTime: `${availabilitySlot.startTime}-${availabilitySlot.endTime}`,
            dayOfWeek: availabilitySlot.dayOfWeek
          }
        };

        eventsToCreate.push(teacherEvent, studentEvent);
      }

      console.log('About to insert', eventsToCreate.length, 'events');

      // Insert all events
      const { error: insertError } = await supabase
        .from('user_events')
        .insert(eventsToCreate);

      if (insertError) {
        console.error('Error creating calendar events:', insertError);
        return false;
      }

      console.log(`Successfully created ${eventsToCreate.length} calendar events for recurring enrollment`);
      
      // Now block or mark the availability slot as occupied for the selected times
      if (availabilitySlot.availabilitySlotId) {
        console.log('Marking availability slot as occupied for recurring class times');
        
        // For each week, we need to create a blocked time entry
        for (let week = 0; week < weeksToCreate; week++) {
          const today = new Date();
          const targetDay = availabilitySlot.dayOfWeek;
          const daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
          const classDate = new Date(today);
          classDate.setDate(today.getDate() + daysUntilTarget + (week * 7));
          
          const [startHour, startMinute] = availabilitySlot.startTime.split(':').map(Number);
          const startTime = new Date(classDate);
          startTime.setHours(startHour, startMinute, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + eventDurationMinutes);
          
          // Create a blocked hours entry for this specific time
          const { error: blockError } = await supabase
            .from('blocked_hours')
            .insert({
              user_id: teacherId,
              day_of_week: availabilitySlot.dayOfWeek,
              start_time: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`,
              end_time: `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:00`,
              reason: `Class: ${course.title} with ${student.first_name} ${student.last_name}`,
              is_recurring: false // Each instance is a separate block
            });
            
          if (blockError) {
            console.error('Error blocking time slot:', blockError);
          }
        }
      }
      
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

      // For one-time courses, we'll create a placeholder event for next week
      // In a real scenario, this would be scheduled based on actual availability
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + 7); // Next week
      eventDate.setHours(14, 0, 0, 0); // 2 PM

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
