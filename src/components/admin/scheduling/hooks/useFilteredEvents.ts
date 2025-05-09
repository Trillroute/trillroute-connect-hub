
import { useState, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { fetchFilteredEvents } from '../utils/eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { fetchStaffForCourse } from '@/services/courses/courseStaffService';
import { fetchStaffForSkill } from '@/services/skills/skillStaffService';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';

interface UseFilteredEventsProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | 'unit' | null;
  filterId?: string | null;
  filterIds?: string[];
}

/**
 * Hook that handles filtering events based on provided filter parameters
 */
export const useFilteredEvents = ({
  filterType,
  filterId,
  filterIds = []
}: UseFilteredEventsProps) => {
  const { refreshEvents, setEvents, setAvailabilities } = useCalendar();
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
      } else if (filterType === 'unit') {
        // For unit filtering, we'll handle this separately in the apply filter logic
        setStaffUserIds([]);
      }
    };
    
    fetchRelatedStaff();
  }, [filterType, filterId, filterIds]);

  // Apply filters when filter type or IDs change
  useEffect(() => {
    console.log("useFilteredEvents received:", { filterType, filterId, filterIds });
    
    if (!filterType) {
      console.log("No filterType specified, refreshing all events");
      refreshEvents();
      return;
    }

    // Apply the appropriate filter
    const applyFilter = async () => {
      // Make sure filterIds is an array
      const safeFilterIds = Array.isArray(filterIds) ? [...filterIds] : [];
      
      // If we have both filterIds array and a single filterId, combine them
      const ids = filterId 
        ? [...safeFilterIds, filterId].filter(Boolean) 
        : safeFilterIds.filter(Boolean);
      
      console.log(`Applying ${filterType} filter with IDs:`, ids);
      
      try {
        await applyFilterByType(filterType, ids);
      } catch (error) {
        console.error("Error applying filter:", error);
        // Fallback to showing all events
        refreshEvents();
        setAvailabilities({});
      }
    };

    applyFilter();
  }, [filterType, filterId, filterIds, staffUserIds, refreshEvents, setEvents, setAvailabilities]);

  // Separate function to apply filter by type to reduce complexity
  const applyFilterByType = async (type: string, ids: string[]) => {
    switch (type) {
      case 'unit':
        // For unit filtering, we'll interpret the IDs as specific unit identifiers
        await fetchFilteredEvents({ unitIds: ids, setEvents });
        setAvailabilities({}); // No availability data for unit filtering
        break;
        
      case 'course':
        await fetchFilteredEvents({ courseIds: ids, setEvents });
        await fetchAndSetAvailabilities();
        break;
        
      case 'skill':
        await fetchFilteredEvents({ skillIds: ids, setEvents });
        await fetchAndSetAvailabilities();
        break;
        
      case 'teacher':
        await fetchFilteredEvents({ 
          roleFilter: ['teacher'],
          userIds: ids.length > 0 ? ids : undefined,
          setEvents 
        });
        
        // Fetch availabilities for these specific teachers or all teachers
        await fetchAvailabilitiesForRole(ids, ['teacher']);
        break;
        
      case 'student':
        await fetchFilteredEvents({ 
          roleFilter: ['student'],
          userIds: ids.length > 0 ? ids : undefined,
          setEvents 
        });
        // Students don't have availabilities, so clear them
        setAvailabilities({});
        break;
        
      case 'admin':
        await fetchFilteredEvents({ 
          roleFilter: ['admin', 'superadmin'], 
          userIds: ids.length > 0 ? ids : undefined,
          setEvents 
        });
        
        // Fetch availabilities for these specific admins or all admins
        await fetchAvailabilitiesForRole(ids, ['admin', 'superadmin']);
        break;
        
      case 'staff':
        await fetchFilteredEvents({ 
          roleFilter: ['teacher', 'admin', 'superadmin'], 
          userIds: ids.length > 0 ? ids : undefined,
          setEvents 
        });
        
        // Fetch availabilities for these specific staff members or all staff
        await fetchAvailabilitiesForRole(ids, ['teacher', 'admin', 'superadmin']);
        break;
        
      default:
        console.log("Unknown filterType, refreshing all events");
        refreshEvents();
        setAvailabilities({});
    }
  };

  // Helper function to fetch availabilities for staff related to courses/skills
  const fetchAndSetAvailabilities = async () => {
    if (staffUserIds.length > 0) {
      const serviceAvailabilities = await fetchUserAvailabilityForUsers(staffUserIds);
      setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
    } else {
      setAvailabilities({}); // Clear availabilities if no staff
    }
  };

  // Helper function to fetch availabilities for specific roles
  const fetchAvailabilitiesForRole = async (userIds: string[], roles: string[]) => {
    if (userIds.length > 0) {
      const serviceAvailabilities = await fetchUserAvailabilityForUsers(userIds);
      setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
    } else {
      // If no specific users, fetch all users with given roles
      const serviceAvailabilities = await fetchUserAvailabilityForUsers([], roles);
      setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
    }
  };
};
