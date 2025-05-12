
import { useEffect, useState } from 'react';
import { fetchStaffForCourse } from '@/services/courses/courseStaffService';
import { fetchStaffForSkill } from '@/services/skills/skillStaffService';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';

interface UseFilteredEventsDataProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

export const useFilteredEventsData = ({
  filterType,
  filterId,
  filterIds = []
}: UseFilteredEventsDataProps) => {
  const [staffUserIds, setStaffUserIds] = useState<string[]>([]);
  
  // Helper function to convert from service type to context type
  const convertAvailabilityMap = (serviceMap: ServiceUserAvailabilityMap): ContextUserAvailabilityMap => {
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
  
  // Get user IDs based on filter type and values
  useEffect(() => {
    const fetchRelatedStaff = async () => {
      if (!filterType) return;
      
      if (filterType === 'course' && (filterId || filterIds.length > 0)) {
        const courseIds = filterId ? [filterId] : filterIds;
        try {
          // Fetch teachers related to these courses
          const staffIds = await fetchStaffForCourse(courseIds);
          setStaffUserIds(staffIds);
        } catch (error) {
          console.error("Error fetching staff for courses:", error);
        }
      } else if (filterType === 'skill' && (filterId || filterIds.length > 0)) {
        const skillIds = filterId ? [filterId] : filterIds;
        try {
          // Fetch teachers related to these skills
          const staffIds = await fetchStaffForSkill(skillIds);
          setStaffUserIds(staffIds);
        } catch (error) {
          console.error("Error fetching staff for skills:", error);
        }
      } else if (['teacher', 'admin', 'staff'].includes(filterType)) {
        // For direct staff selection, just use the provided IDs
        const ids = filterId ? [...filterIds, filterId].filter(Boolean) : filterIds.filter(Boolean);
        setStaffUserIds(ids);
      }
    };
    
    fetchRelatedStaff();
  }, [filterType, filterId, filterIds]);

  // Fetch availabilities for staff members
  const fetchStaffAvailabilities = async (staffIds: string[]) => {
    try {
      if (staffIds.length > 0) {
        const serviceAvailabilities = await fetchUserAvailabilityForUsers(staffIds);
        return convertAvailabilityMap(serviceAvailabilities);
      }
    } catch (error) {
      console.error("Error fetching staff availabilities:", error);
    }
    return {};
  };

  return {
    staffUserIds,
    fetchStaffAvailabilities,
    convertAvailabilityMap
  };
};
