
import { useEffect, useState, useCallback } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { applyFilter } from '../utils/filterUtils';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';
import { fetchStaffForCourse } from '@/services/courses/courseStaffService';
import { fetchStaffForSkill } from '@/services/skills/skillStaffService';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { CalendarEvent } from '../context/calendarTypes';

interface UseFilteredEventsProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
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
}: UseFilteredEventsProps = {}) => {
  const { events, refreshEvents } = useCalendar();
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [staffUserIds, setStaffUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState<ContextUserAvailabilityMap>({});
  
  // Helper function to convert from service type to context type
  const convertAvailabilityMap = useCallback((serviceMap: ServiceUserAvailabilityMap): ContextUserAvailabilityMap => {
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
  }, []);
  
  // Get user IDs based on filter type and values
  useEffect(() => {
    const fetchRelatedStaff = async () => {
      if (!filterType) return;
      
      setIsLoading(true);
      
      try {
        if (filterType === 'course' && (filterId || filterIds.length > 0)) {
          const courseIds = filterId ? [filterId] : filterIds;
          // Fetch teachers related to these courses
          const staffIds = await fetchStaffForCourse(courseIds);
          setStaffUserIds(staffIds);
        } else if (filterType === 'skill' && (filterId || filterIds.length > 0)) {
          const skillIds = filterId ? [filterId] : filterIds;
          // Fetch teachers related to these skills
          const staffIds = await fetchStaffForSkill(skillIds);
          setStaffUserIds(staffIds);
        } else if (['teacher', 'admin', 'staff'].includes(filterType)) {
          // For direct staff selection, just use the provided IDs
          const ids = filterId ? [...filterIds, filterId].filter(Boolean) : filterIds.filter(Boolean);
          setStaffUserIds(ids);
        }
      } catch (error) {
        console.error(`Error fetching staff for ${filterType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedStaff();
  }, [filterType, filterId, JSON.stringify(filterIds)]);

  // Apply filters when filter type or IDs change
  useEffect(() => {
    console.log("useFilteredEvents received:", { filterType, filterId, filterIds });
    
    if (!filterType) {
      console.log("No filterType specified, refreshing all events");
      refreshEvents().then(events => {
        if (events) setFilteredEvents(events);
      });
      return;
    }

    // Apply the appropriate filter
    const applyFilters = async () => {
      setIsLoading(true);
      try {
        // Make sure filterIds is an array
        const safeFilterIds = Array.isArray(filterIds) ? [...filterIds] : [];
        
        // If we have both filterIds array and a single filterId, combine them
        const ids = filterId 
          ? [...safeFilterIds, filterId].filter(Boolean) 
          : safeFilterIds.filter(Boolean);
        
        // Get availabilities for related staff
        if (staffUserIds.length > 0) {
          const staffAvailabilities = await fetchUserAvailabilityForUsers(staffUserIds);
          const convertedAvailabilities = convertAvailabilityMap(staffAvailabilities);
          setAvailabilities(convertedAvailabilities);
        }
        
        // Filter events
        const result = await applyFilter({
          filterType,
          ids,
          staffUserIds,
          convertAvailabilityMap
        });
        
        if (result && result.events) {
          setFilteredEvents(result.events);
        }
        
        if (result && result.availabilities) {
          setAvailabilities(result.availabilities);
        }
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    applyFilters();
  }, [filterType, filterId, JSON.stringify(filterIds), staffUserIds, refreshEvents, convertAvailabilityMap]);

  return {
    events: filteredEvents.length > 0 ? filteredEvents : events,
    isLoading,
    availabilities,
    staffUserIds
  };
};
