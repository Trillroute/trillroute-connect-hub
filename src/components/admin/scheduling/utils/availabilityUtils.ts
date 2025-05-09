
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';

/**
 * Helper function to convert from service type to context type
 */
export const convertAvailabilityMap = (serviceMap: ServiceUserAvailabilityMap): ContextUserAvailabilityMap => {
  const contextMap: ContextUserAvailabilityMap = {};
  
  Object.keys(serviceMap).forEach(userId => {
    const userInfo = serviceMap[userId];
    contextMap[userId] = {
      slots: userInfo.slots,
      name: userInfo.name,
      role: userInfo.role || 'teacher' // Default to teacher if role is not provided
    };
  });
  
  return contextMap;
};
