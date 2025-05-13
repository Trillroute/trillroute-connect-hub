
import { useState, useEffect } from 'react';
import { fetchStaffForCourse } from '@/services/courses/courseStaffService';
import { fetchStaffForSkill } from '@/services/skills/skillStaffService';

interface UseStaffFetcherProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterIds: string[];
}

/**
 * Hook that fetches staff members related to courses/skills
 */
export const useStaffFetcher = ({ filterType, filterIds }: UseStaffFetcherProps) => {
  const [staffUserIds, setStaffUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get staff IDs for course/skill filters - only run when filters change
  useEffect(() => {
    if (!filterType || !filterIds.length) {
      setStaffUserIds([]);
      return;
    }
    
    const fetchRelatedStaff = async () => {
      setIsLoading(true);
      
      try {
        let staffIds: string[] = [];
        
        if (filterType === 'course') {
          // Fetch teachers related to these courses
          staffIds = await fetchStaffForCourse(filterIds);
          if (process.env.NODE_ENV === 'development') {
            console.log(`Found ${staffIds.length} staff members for courses:`, filterIds);
          }
        } else if (filterType === 'skill') {
          // Fetch teachers related to these skills
          staffIds = await fetchStaffForSkill(filterIds);
          if (process.env.NODE_ENV === 'development') {
            console.log(`Found ${staffIds.length} staff members for skills:`, filterIds);
          }
        } else if (['teacher', 'admin', 'staff'].includes(filterType)) {
          // For direct staff selection, just use the provided IDs
          staffIds = filterIds;
        }
        
        setStaffUserIds(staffIds);
      } catch (error) {
        console.error(`Error fetching staff for ${filterType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedStaff();
  }, [filterType, JSON.stringify(filterIds)]);

  return { staffUserIds, isLoading: isLoading };
};
