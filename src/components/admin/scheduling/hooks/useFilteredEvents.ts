
import { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../context/calendarTypes';
import { fetchFilteredEvents } from '../utils/eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../context/calendarTypes';
import { fetchStaffForCourse } from '@/services/courses/courseStaffService';
import { fetchStaffForSkill } from '@/services/skills/skillStaffService';

interface UseFilteredEventsProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

export const useFilteredEvents = ({
  filterType,
  filterId,
  filterIds = []
}: UseFilteredEventsProps = {}) => {
  const { refreshEvents } = useCalendar();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [availabilities, setAvailabilities] = useState<ContextUserAvailabilityMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [staffUserIds, setStaffUserIds] = useState<string[]>([]);
  
  // Helper function to convert from service availability to context availability
  const convertAvailabilityMap = (serviceMap: ServiceUserAvailabilityMap): ContextUserAvailabilityMap => {
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
  };

  // Combine filterId and filterIds for consistent handling
  const allFilterIds = filterId 
    ? [...filterIds.filter(Boolean), filterId].filter(Boolean) 
    : filterIds.filter(Boolean);
  
  // Get staff IDs for course/skill filters
  useEffect(() => {
    const fetchRelatedStaff = async () => {
      if (!filterType) return;
      
      setIsLoading(true);
      
      try {
        if (filterType === 'course' && allFilterIds.length > 0) {
          // Fetch teachers related to these courses
          const staffIds = await fetchStaffForCourse(allFilterIds);
          console.log(`Found ${staffIds.length} staff members for courses:`, allFilterIds);
          setStaffUserIds(staffIds);
        } else if (filterType === 'skill' && allFilterIds.length > 0) {
          // Fetch teachers related to these skills
          const staffIds = await fetchStaffForSkill(allFilterIds);
          console.log(`Found ${staffIds.length} staff members for skills:`, allFilterIds);
          setStaffUserIds(staffIds);
        } else if (['teacher', 'admin', 'staff'].includes(filterType)) {
          // For direct staff selection, just use the provided IDs
          setStaffUserIds(allFilterIds);
        }
      } catch (error) {
        console.error(`Error fetching staff for ${filterType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedStaff();
  }, [filterType, allFilterIds]);

  // Effect to filter events or fetch new ones based on filter parameters
  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      try {
        // If no filter type is specified, just refresh all events
        if (!filterType) {
          console.log('No filterType specified, refreshing all events');
          await refreshEvents();
          return;
        }

        console.log(`Applying filters: ${filterType}`, {
          allFilterIds,
          staffUserIds,
          hasStaffForIndirectFilter: ['course', 'skill'].includes(filterType) && staffUserIds.length > 0
        });

        // For specific filter types with IDs
        if (allFilterIds.length > 0 || filterType) {
          // Determine which IDs to use for filtering
          const userIds = ['teacher', 'student', 'admin', 'staff'].includes(filterType) 
            ? allFilterIds 
            : undefined;
          
          const courseIds = filterType === 'course' ? allFilterIds : undefined;
          const skillIds = filterType === 'skill' ? allFilterIds : undefined;
          
          // Get role filters based on filter type
          const roleFilter = getRoleFilterForType(filterType);
          
          console.log(`Fetching events with params:`, { 
            userIds, courseIds, skillIds, roleFilter 
          });
          
          // Fetch filtered events
          await fetchFilteredEvents({ 
            userIds,
            courseIds,
            skillIds,
            roleFilter,
            setEvents: (fetchedEvents) => {
              console.log(`Received ${fetchedEvents.length} events from filtering`);
              setEvents(fetchedEvents);
            }
          });
          
          // Also fetch availabilities for appropriate filter types
          if (isStaffFilterType(filterType)) {
            // For direct staff filters, use selected IDs
            if (allFilterIds.length > 0) {
              console.log(`Fetching availability for specific staff:`, allFilterIds);
              const serviceAvailabilities = await fetchUserAvailabilityForUsers(allFilterIds);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            } 
            // For unspecified staff filter, get all staff of that type
            else if (filterType) {
              console.log(`Fetching availability for all ${filterType} users`);
              const roles = getRoleFilterForType(filterType);
              const serviceAvailabilities = await fetchUserAvailabilityForUsers([], roles);
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            }
          }
          // For course/skill filters, fetch availabilities of associated staff
          else if ((filterType === 'course' || filterType === 'skill') && staffUserIds.length > 0) {
            console.log(`Fetching availability for ${staffUserIds.length} staff associated with ${filterType}`);
            const serviceAvailabilities = await fetchUserAvailabilityForUsers(staffUserIds);
            setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
          } else {
            // Clear availabilities for non-staff filters
            setAvailabilities({});
          }
        }
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    applyFilters();
  }, [filterType, staffUserIds, JSON.stringify(allFilterIds), refreshEvents]);

  // Helper function to get role filter values based on filter type
  const getRoleFilterForType = (type: string): string[] => {
    switch (type) {
      case 'teacher': return ['teacher'];
      case 'student': return ['student'];
      case 'admin': return ['admin', 'superadmin'];
      case 'staff': return ['teacher', 'admin', 'superadmin'];
      default: return [];
    }
  };
  
  // Helper function to check if filter type is related to staff
  const isStaffFilterType = (type: string): boolean => {
    return ['teacher', 'admin', 'staff'].includes(type);
  };

  return { events, isLoading, availabilities };
};
