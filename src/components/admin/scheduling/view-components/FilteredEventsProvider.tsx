
import React, { useEffect, useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { fetchFilteredEvents } from '../utils/eventProcessing';
import { fetchUserAvailabilityForUsers } from '@/services/availability/availabilityApi';
import { fetchStaffForCourse } from '@/services/courses/courseStaffService';
import { fetchStaffForSkill } from '@/services/skills/skillStaffService';

interface FilteredEventsProviderProps {
  children: React.ReactNode;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
}

/**
 * Component that handles filtering events based on provided filter parameters
 */
export const FilteredEventsProvider: React.FC<FilteredEventsProviderProps> = ({
  children,
  filterType,
  filterId,
  filterIds = []
}) => {
  const { refreshEvents, setEvents, setAvailabilities } = useCalendar();
  const [staffUserIds, setStaffUserIds] = useState<string[]>([]);
  
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
  
  // Apply filters when filter type or IDs change
  useEffect(() => {
    console.log("FilteredEventsProvider received:", { filterType, filterId, filterIds });
    
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
        // Fetch events based on filter type
        switch (filterType) {
          case 'course':
            await fetchFilteredEvents({ courseIds: ids, setEvents });
            
            // Also fetch availabilities for staff teaching these courses
            if (staffUserIds.length > 0) {
              const availabilities = await fetchUserAvailabilityForUsers(staffUserIds);
              setAvailabilities(availabilities);
            } else {
              setAvailabilities({}); // Clear availabilities if no staff
            }
            break;
            
          case 'skill':
            await fetchFilteredEvents({ skillIds: ids, setEvents });
            
            // Also fetch availabilities for staff teaching these skills
            if (staffUserIds.length > 0) {
              const availabilities = await fetchUserAvailabilityForUsers(staffUserIds);
              setAvailabilities(availabilities);
            } else {
              setAvailabilities({}); // Clear availabilities if no staff
            }
            break;
            
          case 'teacher':
            await fetchFilteredEvents({ 
              roleFilter: ['teacher'],
              userIds: ids.length > 0 ? ids : undefined,
              setEvents 
            });
            
            // Fetch availabilities for these specific teachers
            if (ids.length > 0) {
              const availabilities = await fetchUserAvailabilityForUsers(ids);
              setAvailabilities(availabilities);
            } else {
              // If no specific teachers, fetch all teacher availabilities
              const availabilities = await fetchUserAvailabilityForUsers([], ['teacher']);
              setAvailabilities(availabilities);
            }
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
            
            // Fetch availabilities for these specific admins
            if (ids.length > 0) {
              const availabilities = await fetchUserAvailabilityForUsers(ids);
              setAvailabilities(availabilities);
            } else {
              // If no specific admins, fetch all admin availabilities
              const availabilities = await fetchUserAvailabilityForUsers([], ['admin', 'superadmin']);
              setAvailabilities(availabilities);
            }
            break;
            
          case 'staff':
            await fetchFilteredEvents({ 
              roleFilter: ['teacher', 'admin', 'superadmin'], 
              userIds: ids.length > 0 ? ids : undefined,
              setEvents 
            });
            
            // Fetch availabilities for these specific staff members
            if (ids.length > 0) {
              const availabilities = await fetchUserAvailabilityForUsers(ids);
              setAvailabilities(availabilities);
            } else {
              // If no specific staff, fetch all staff availabilities
              const availabilities = await fetchUserAvailabilityForUsers([], ['teacher', 'admin', 'superadmin']);
              setAvailabilities(availabilities);
            }
            break;
            
          default:
            console.log("Unknown filterType, refreshing all events");
            refreshEvents();
            setAvailabilities({});
        }
      } catch (error) {
        console.error("Error applying filter:", error);
        // Fallback to showing all events
        refreshEvents();
        setAvailabilities({});
      }
    };

    applyFilter();
  }, [filterType, filterId, filterIds, staffUserIds, refreshEvents, setEvents, setAvailabilities]);

  return <>{children}</>;
};
