
import { AvailabilitySlot } from './types';

// Map database availability to frontend format
export const mapFromDbAvailability = (dbEvent: any): AvailabilitySlot => {
  // Create a base availability object
  const availability: AvailabilitySlot = {
    id: dbEvent.id,
    teacherId: dbEvent.user_id,
    startTime: new Date(dbEvent.start_time),
    endTime: new Date(dbEvent.end_time),
    isBooked: dbEvent.event_type === 'trial_booking',
  };

  // Add optional fields if they exist in metadata
  if (dbEvent.metadata && typeof dbEvent.metadata === 'object') {
    const metadata = dbEvent.metadata as Record<string, any>;
    
    if (metadata.course_id) {
      availability.courseId = metadata.course_id;
    }
    
    if (metadata.course_title) {
      availability.courseTitle = metadata.course_title;
    }
    
    if (metadata.student_id) {
      availability.studentId = metadata.student_id;
    }
  }

  return availability;
};
