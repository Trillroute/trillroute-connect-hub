
import { useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { fetchFilteredEvents } from '../utils/eventProcessing';

interface UseEventFiltersProps {
  userId?: string;
  userIds?: string[];
  roleFilter?: string[];
  courseId?: string;
  skillId?: string;
}

export const useEventFilters = ({
  userId,
  userIds,
  roleFilter,
  courseId,
  skillId
}: UseEventFiltersProps) => {
  const { setEvents, refreshEvents } = useCalendar();

  useEffect(() => {
    const applyFilters = async () => {
      if (userId || userIds?.length > 0 || roleFilter?.length > 0 || courseId || skillId) {
        await fetchFilteredEvents({
          userId,
          userIds,
          courseId,
          skillId,
          roleFilter,
          setEvents
        });
      } else {
        // If no filters are applied, use the regular refresh
        await refreshEvents();
      }
    };
    
    applyFilters();
  }, [userId, userIds, roleFilter, courseId, skillId, setEvents, refreshEvents]);
};
