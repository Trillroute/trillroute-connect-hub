
import { applySkillFilter } from './skillFilter';
import { applyRoleFilter } from './roleFilter';
import { applyCourseFilter } from './courseFilter';
import { fetchFilteredEvents } from '../eventProcessing';
import { fetchAvailabilityForUsers, convertAvailabilityMap } from './availabilityHelper';
import { ApplyFilterOptions } from './types';
import { toast } from '@/components/ui/use-toast';

/**
 * Apply filters based on type and fetch appropriate data
 */
export const applyFilter = async ({
  filterType,
  ids,
  staffUserIds,
  setEvents,
  setAvailabilities,
  convertAvailabilityMap
}: ApplyFilterOptions): Promise<void> => {
  console.log(`==== APPLYING ${filterType?.toUpperCase() || 'UNKNOWN'} FILTER ====`);
  console.log('Filter IDs:', ids);
  
  try {
    // If no filter type or ids, clear everything
    if (!filterType || !ids || ids.length === 0) {
      console.log('No filter type or IDs, clearing data');
      setEvents([]);
      setAvailabilities({});
      return;
    }
    
    // Fetch events based on filter type
    switch (filterType) {
      case 'course':
        await applyCourseFilter(ids, staffUserIds, setEvents, setAvailabilities, convertAvailabilityMap);
        break;
        
      case 'skill':
        await applySkillFilter(ids, setEvents, setAvailabilities, convertAvailabilityMap);
        break;
        
      case 'teacher':
      case 'student':
      case 'admin':
      case 'staff':
        await applyRoleFilter({
          ids,
          filterType,
          setEvents,
          setAvailabilities,
          convertAvailabilityMap
        });
        break;
        
      default:
        // Default case - fetch all events and all staff availabilities
        await fetchFilteredEvents({ setEvents });
        const allAvailabilities = await fetchAvailabilityForUsers([], ['teacher', 'admin', 'superadmin']);
        setAvailabilities(convertAvailabilityMap(allAvailabilities));
        break;
    }
  } catch (error) {
    console.error("Error applying filter:", error);
    toast({
      title: "Error applying filter",
      description: "An error occurred while filtering. Please try again.",
      variant: "destructive"
    });
    // Set empty data in case of error to prevent UI from breaking
    setEvents([]);
    setAvailabilities({});
  }
};

export { convertAvailabilityMap };
