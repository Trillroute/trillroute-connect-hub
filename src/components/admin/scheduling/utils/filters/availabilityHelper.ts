
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../../context/calendarTypes';
import { fetchUserAvailabilityForUsers } from '@/services/availability/api';
import { toast } from '@/components/ui/use-toast';

/**
 * Helper function to fetch availabilities for users based on role
 */
export const fetchAvailabilityForUsers = async (
  userIds: string[] = [], 
  roles: string[] = []
): Promise<ServiceUserAvailabilityMap> => {
  try {
    return await fetchUserAvailabilityForUsers(userIds, roles);
  } catch (error) {
    console.error("Error fetching user availabilities:", error);
    toast({
      title: "Error fetching availabilities",
      description: "Could not load availability data.",
      variant: "destructive"
    });
    return {};
  }
};

/**
 * Converts service availability map to context availability map
 */
export const convertAvailabilityMap = (
  serviceMap: ServiceUserAvailabilityMap
): ContextUserAvailabilityMap => {
  const result: ContextUserAvailabilityMap = {};
  
  Object.entries(serviceMap).forEach(([userId, userData]) => {
    result[userId] = {
      slots: userData.slots.map(slot => ({
        id: slot.id,
        user_id: slot.user_id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        category: slot.category || 'Default'
      })),
      name: userData.name,
      role: userData.role
    };
  });
  
  return result;
};
