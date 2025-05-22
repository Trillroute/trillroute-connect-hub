
import { UserAvailability, DbUserAvailability } from './types';

/**
 * Map database availability format to frontend format
 */
export function mapDbToUserAvailability(dbAvailability: DbUserAvailability): UserAvailability {
  return {
    id: dbAvailability.id,
    user_id: dbAvailability.user_id,
    dayOfWeek: dbAvailability.day_of_week,
    startTime: dbAvailability.start_time,
    endTime: dbAvailability.end_time,
    category: dbAvailability.category,
    created_at: dbAvailability.created_at,
    updated_at: dbAvailability.updated_at
  };
}

/**
 * Map frontend availability format to database format
 */
export function mapUserToDbAvailability(userAvailability: UserAvailability): DbUserAvailability {
  return {
    id: userAvailability.id,
    user_id: userAvailability.user_id,
    day_of_week: userAvailability.dayOfWeek,
    start_time: userAvailability.startTime,
    end_time: userAvailability.endTime,
    category: userAvailability.category,
    created_at: userAvailability.created_at,
    updated_at: userAvailability.updated_at
  };
}
