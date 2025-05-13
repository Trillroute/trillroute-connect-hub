
import { useCallback } from 'react';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';

/**
 * Hook that provides utility functions for converting availability maps
 */
export const useAvailabilityMapper = () => {
  // Helper function to convert from service availability to context availability
  const convertAvailabilityMap = useCallback((serviceMap: ServiceUserAvailabilityMap): ContextUserAvailabilityMap => {
    const contextMap: ContextUserAvailabilityMap = {};
    
    Object.keys(serviceMap).forEach(userId => {
      const userInfo = serviceMap[userId];
      contextMap[userId] = {
        slots: userInfo.slots,
        name: userInfo.name,
        role: userInfo.role || 'teacher'
      };
    });
    
    return contextMap;
  }, []);

  return { convertAvailabilityMap };
};
