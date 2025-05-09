
import { useState, useEffect } from 'react';
import { fetchStaffForCourse } from '@/services/courses/courseStaffService';
import { fetchStaffForSkill } from '@/services/skills/skillStaffService';

/**
 * Hook to manage related staff/user IDs based on filter type and filter values
 */
export const useEventFilterData = (
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null,
  filterId?: string | null,
  filterIds: string[] = []
) => {
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

  return { staffUserIds };
};
