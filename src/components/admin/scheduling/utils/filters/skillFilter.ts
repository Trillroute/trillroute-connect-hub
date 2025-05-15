
import { CalendarEvent } from '../../types';
import { UserAvailabilityMap as ServiceUserAvailabilityMap } from '@/services/availability/types';
import { UserAvailabilityMap as ContextUserAvailabilityMap } from '../../context/calendarTypes';
import { fetchFilteredEvents } from '../eventProcessing';
import { getUsersBySkills, seedUserSkills } from '@/services/skills/skillStaffService';
import { toast } from '@/components/ui/use-toast';
import { fetchAvailabilityForUsers } from './availabilityHelper';

type SetEventsFunction = (events: CalendarEvent[]) => void;
type SetAvailabilitiesFunction = (availabilities: ContextUserAvailabilityMap) => void;

/**
 * Apply skill-based filtering
 */
export const applySkillFilter = async (
  ids: string[],
  setEvents: SetEventsFunction,
  setAvailabilities: SetAvailabilitiesFunction,
  convertAvailabilityMap: (serviceMap: ServiceUserAvailabilityMap) => ContextUserAvailabilityMap
): Promise<void> => {
  console.log('==== SKILL FILTER ====');
  console.log('Processing skill filter for IDs:', ids);
  
  // Try to seed skills for testing if no users are found
  const shouldSeedSkills = process.env.NODE_ENV === 'development';
  
  // Show toast to indicate filtering is in progress
  toast({
    title: "Filtering by skills",
    description: `Finding users with selected skills...`,
  });
  
  // First, get all users with these skills (no role filter initially)
  const usersWithSkills = await getUsersBySkills(ids);
  console.log('Users with selected skills:', usersWithSkills);
  
  if (usersWithSkills.length === 0 && shouldSeedSkills) {
    console.log('No users found with skills, attempting to seed skill data...');
    await seedUserSkills();
    // Try again after seeding
    const usersAfterSeed = await getUsersBySkills(ids);
    if (usersAfterSeed.length > 0) {
      console.log('Found users after seeding:', usersAfterSeed);
      toast({
        title: "Development mode",
        description: "Seeded skill data for testing. Please refresh.",
      });
    }
  }
  
  if (usersWithSkills.length === 0) {
    console.log('No users found with the selected skills, clearing calendar');
    toast({
      title: "No matching users",
      description: "No users with the selected skills were found.",
      variant: "destructive"
    });
    setEvents([]);
    setAvailabilities({});
    return;
  }
  
  // Show success toast with number of users found
  toast({
    title: "Users found",
    description: `Found ${usersWithSkills.length} users with the selected skills.`,
  });
  
  // Get teachers with these skills (for availability)
  const teachersWithSkills = await getUsersBySkills(ids, ['teacher']);
  console.log('Teachers with selected skills:', teachersWithSkills);
  
  // Fetch events for users who have these skills
  await fetchFilteredEvents({ 
    userIds: usersWithSkills,
    skillIds: ids,  // Pass skill IDs directly to event processing
    setEvents 
  });
  
  // Use teachers for availability if found, otherwise use all users with skills
  const userIdsForAvailability = teachersWithSkills.length > 0 ? teachersWithSkills : usersWithSkills;
  
  console.log('Fetching availability for users:', userIdsForAvailability);
  
  // Fetch availabilities for users with these skills
  const serviceAvailabilities = await fetchAvailabilityForUsers(userIdsForAvailability);
  
  console.log('Retrieved availability data:', 
    Object.keys(serviceAvailabilities).length, 
    'users with availability'
  );
  
  setAvailabilities(convertAvailabilityMap(serviceAvailabilities));
};
