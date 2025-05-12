
import { AvailabilitySlot } from './types';

// Map database availability to frontend format
export const mapFromDbAvailability = (dbEvent: any): AvailabilitySlot => ({
  id: dbEvent.id,
  teacherId: dbEvent.user_id,
  startTime: new Date(dbEvent.start_time),
  endTime: new Date(dbEvent.end_time),
  isBooked: dbEvent.event_type === 'trial_booking',
  courseId: dbEvent.metadata && typeof dbEvent.metadata === 'object' ? dbEvent.metadata.course_id : undefined,
  studentId: dbEvent.metadata && typeof dbEvent.metadata === 'object' ? dbEvent.metadata.student_id : undefined,
});

