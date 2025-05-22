
import { supabase } from '@/integrations/supabase/client';
import { UserAvailability } from '@/services/availability/types';

/**
 * Fetches overlapping availability slots for multiple teachers
 * @param teacherIds Array of teacher IDs to find overlapping availability for
 * @returns Promise with overlapping availability slots
 */
export const fetchOverlappingAvailability = async (teacherIds: string[]): Promise<UserAvailability[]> => {
  try {
    if (!teacherIds.length) {
      return [];
    }

    // Get all availability slots for all teachers
    const { data, error } = await supabase
      .from('user_availability')
      .select('*')
      .in('user_id', teacherIds);

    if (error) {
      console.error('Error fetching teacher availability:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group slots by day of week
    const slotsByDay = data.reduce((acc, slot) => {
      if (!acc[slot.day_of_week]) {
        acc[slot.day_of_week] = [];
      }
      acc[slot.day_of_week].push(slot);
      return acc;
    }, {} as Record<number, UserAvailability[]>);

    // Find overlapping slots for each day
    const overlappingSlots: UserAvailability[] = [];

    Object.keys(slotsByDay).forEach(dayKey => {
      const day = parseInt(dayKey);
      const daySlots = slotsByDay[day];
      
      // Group slots by teacher
      const slotsByTeacher = teacherIds.map(teacherId => {
        return daySlots.filter(slot => slot.user_id === teacherId);
      });
      
      // No overlaps possible if any teacher has no slots for this day
      if (slotsByTeacher.some(teacherSlots => teacherSlots.length === 0)) {
        return;
      }
      
      // Find overlapping time ranges
      const timeRanges = slotsByTeacher.flat().map(slot => ({
        start: slot.start_time,
        end: slot.end_time,
        userId: slot.user_id,
        id: slot.id,
        dayOfWeek: slot.day_of_week,
        createdAt: slot.created_at,
        updatedAt: slot.updated_at,
        category: slot.category
      }));
      
      // For each starting point, find if all teachers have availability
      for (const range of timeRanges) {
        const startTime = range.start;
        const teachersAvailableAtStart = teacherIds.every(teacherId => 
          slotsByTeacher
            .find(teacherSlots => teacherSlots[0]?.user_id === teacherId)
            ?.some(slot => 
              slot.start_time <= startTime && 
              slot.end_time >= startTime
            )
        );
        
        if (teachersAvailableAtStart) {
          // Find the earliest end time among all teachers for this start time
          let earliestEndTime = range.end;
          
          teacherIds.forEach(teacherId => {
            const teacherSlots = slotsByTeacher
              .find(slots => slots[0]?.user_id === teacherId) || [];
            
            // Find slots that contain this start time
            const containingSlots = teacherSlots.filter(
              slot => slot.start_time <= startTime && slot.end_time >= startTime
            );
            
            if (containingSlots.length > 0) {
              // Find the earliest end time
              const slotEndTime = containingSlots.reduce(
                (earliest, slot) => slot.end_time < earliest ? slot.end_time : earliest,
                containingSlots[0].end_time
              );
              
              if (slotEndTime < earliestEndTime) {
                earliestEndTime = slotEndTime;
              }
            }
          });
          
          // Create a new overlapping slot
          overlappingSlots.push({
            id: range.id,
            user_id: 'overlapping',
            day_of_week: day,
            start_time: startTime,
            end_time: earliestEndTime,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: 'Overlapping'
          });
        }
      }
    });

    return overlappingSlots;
  } catch (error) {
    console.error('Unexpected error in fetchOverlappingAvailability:', error);
    return [];
  }
};
