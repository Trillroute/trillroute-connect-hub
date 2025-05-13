
import { useEffect, useState, useCallback, useMemo } from 'react';
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

  // Combine filterId and filterIds for consistent handling - computed once
  const allFilterIds = useMemo(() => {
    return filterId 
      ? [...filterIds.filter(Boolean), filterId].filter(Boolean) 
      : filterIds.filter(Boolean);
  }, [filterId, filterIds]);
  
  // Get staff IDs for course/skill filters - only run when filters change
  useEffect(() => {
    if (!filterType || !allFilterIds.length) return;
    
    const fetchRelatedStaff = async () => {
      setIsLoading(true);
      
      try {
        let staffIds: string[] = [];
        
        if (filterType === 'course') {
          // Fetch teachers related to these courses
          staffIds = await fetchStaffForCourse(allFilterIds);
          if (process.env.NODE_ENV === 'development') {
            console.log(`Found ${staffIds.length} staff members for courses:`, allFilterIds);
          }
        } else if (filterType === 'skill') {
          // Fetch teachers related to these skills
          staffIds = await fetchStaffForSkill(allFilterIds);
          if (process.env.NODE_ENV === 'development') {
            console.log(`Found ${staffIds.length} staff members for skills:`, allFilterIds);
          }
        } else if (['teacher', 'admin', 'staff'].includes(filterType)) {
          // For direct staff selection, just use the provided IDs
          staffIds = allFilterIds;
        }
        
        setStaffUserIds(staffIds);
      } catch (error) {
        console.error(`Error fetching staff for ${filterType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedStaff();
  }, [filterType, JSON.stringify(allFilterIds)]);

  // Effect to filter events or fetch new ones based on filter parameters
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    
    const applyFilters = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      
      try {
        // If no filter type is specified, just refresh all events
        if (!filterType) {
          if (process.env.NODE_ENV === 'development') {
            console.log('No filterType specified, refreshing all events');
          }
          
          // Fix: Store the result of refreshEvents() in a variable and then check it
          const refreshedEvents = await refreshEvents();
          if (isMounted && refreshedEvents) {
            setEvents(refreshedEvents);
          }
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`Applying filters: ${filterType}`, {
            allFilterIds,
            staffUserIds,
            hasStaffForIndirectFilter: ['course', 'skill'].includes(filterType) && staffUserIds.length > 0
          });
        }

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
          
          // Fetch filtered events
          await fetchFilteredEvents({ 
            userIds,
            courseIds,
            skillIds,
            roleFilter,
            setEvents: (fetchedEvents) => {
              if (isMounted) {
                setEvents(fetchedEvents);
              }
            }
          });
          
          // Also fetch availabilities for appropriate filter types
          if (isStaffFilterType(filterType)) {
            // For direct staff filters, use selected IDs
            if (allFilterIds.length > 0) {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Fetching availability for specific staff:`, allFilterIds);
              }
              
              const serviceAvailabilities = await fetchUserAvailabilityForUsers(allFilterIds);
              if (isMounted) {
                setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
              }
            } 
            // For unspecified staff filter, get all staff of that type
            else if (filterType) {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Fetching availability for all ${filterType} users`);
              }
              
              const roles = getRoleFilterForType(filterType);
              const serviceAvailabilities = await fetchUserAvailabilityForUsers([], roles);
              if (isMounted) {
                setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
              }
            }
          }
          // For course/skill filters, fetch availabilities of associated staff
          else if ((filterType === 'course' || filterType === 'skill') && staffUserIds.length > 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`Fetching availability for ${staffUserIds.length} staff associated with ${filterType}`);
            }
            
            const serviceAvailabilities = await fetchUserAvailabilityForUsers(staffUserIds);
            if (isMounted) {
              setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
            }
          } else {
            // Clear availabilities for non-staff filters
            setAvailabilities({});
          }
        }
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    applyFilters();
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [filterType, staffUserIds, JSON.stringify(allFilterIds), refreshEvents, convertAvailabilityMap]);

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
