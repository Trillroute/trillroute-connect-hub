
import { UserAvailability } from '../types';

// Helper to map from database availability slot to UserAvailability type
export const mapDbAvailabilitySlot = (dbSlot: any): UserAvailability => {
  if (!dbSlot) {
    console.error('Attempted to map null or undefined db slot');
    throw new Error('Cannot map null or undefined slot');
  }

  // Debug log
  console.log('Mapping DB slot:', dbSlot);

  const result: UserAvailability = {
    id: dbSlot.id,
    user_id: dbSlot.user_id,
    dayOfWeek: typeof dbSlot.day_of_week === 'number' ? dbSlot.day_of_week : parseInt(dbSlot.day_of_week),
    startTime: dbSlot.start_time,
    endTime: dbSlot.end_time,
    category: dbSlot.category || 'Session'
  };

  if (dbSlot.created_at) {
    result.created_at = dbSlot.created_at;
  }

  if (dbSlot.updated_at) {
    result.updated_at = dbSlot.updated_at;
  }

  // Debug log the result
  console.log('Mapped to UserAvailability:', result);

  return result;
};
