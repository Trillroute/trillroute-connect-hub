
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrialSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  courseId: string;
  courseTitle?: string;
  teacherId: string;
  teacherName?: string;
  isBooked: boolean;
  studentId?: string;
  createdAt: Date;
}

const mapDbEventToTrialSlot = (dbEvent: any): TrialSlot => ({
  id: dbEvent.id,
  startTime: new Date(dbEvent.start_time),
  endTime: new Date(dbEvent.end_time),
  courseId: dbEvent.metadata && typeof dbEvent.metadata === 'object' ? dbEvent.metadata.course_id : undefined,
  courseTitle: dbEvent.courses?.title,
  teacherId: dbEvent.user_id,
  teacherName: dbEvent.teachers ? `${dbEvent.teachers.first_name} ${dbEvent.teachers.last_name}` : undefined,
  isBooked: dbEvent.event_type === 'trial_booking',
  studentId: dbEvent.metadata && typeof dbEvent.metadata === 'object' ? dbEvent.metadata.student_id : undefined,
  createdAt: new Date(dbEvent.created_at),
});

export function useTrialSlots() {
  const [mySlots, setMySlots] = useState<TrialSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get upcoming slots where the user is a teacher or a student 
  const fetchMyTrialSlots = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase.from('user_events')
        .select(`
          *,
          courses:metadata->course_id (title),
          teachers:user_id (first_name, last_name),
          students:metadata->student_id (first_name, last_name)
        `)
        .or('event_type.eq.availability,event_type.eq.trial_booking')
        .order('start_time', { ascending: true });

      // If user is a student, get slots booked by them
      if (user.role === 'student') {
        query = query.contains('metadata', { student_id: user.id });
      } 
      // If user is a teacher, get their available slots
      else if (user.role === 'teacher') {
        query = query.eq('user_id', user.id);
      }
      // If user is an admin, they can see all slots
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching trial slots:', error);
        return;
      }
      
      const mappedSlots = data ? data.map(mapDbEventToTrialSlot) : [];
      setMySlots(mappedSlots);
    } catch (err) {
      console.error('Failed to fetch trial slots:', err);
      toast({
        title: "Failed to load trial slots",
        description: "There was a problem loading your trial class bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);
  
  // Cancel a trial slot that was booked
  const cancelTrialSlot = async (slotId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Get slot information first
      const { data: eventData } = await supabase
        .from('user_events')
        .select('*')
        .eq('id', slotId)
        .single();
      
      if (!eventData) {
        console.error('Event not found for cancellation');
        return false;
      }
      
      // If this is a trial booking, we need to unblock the original availability event
      if (eventData.event_type === 'trial_booking') {
        // Safely access metadata properties
        const metadata = eventData.metadata as Record<string, any> | null;
        const originalEventId = metadata && metadata.availability_event_id;
        
        if (originalEventId) {
          // Unblock the original availability event
          await supabase
            .from('user_events')
            .update({
              is_blocked: false,
              metadata: {
                ...(typeof eventData.metadata === 'object' ? eventData.metadata : {}),
                booked_by: null,
                booked_at: null
              }
            })
            .eq('id', originalEventId);
        }
        
        // Delete the booking event
        const { error } = await supabase
          .from('user_events')
          .delete()
          .eq('id', slotId);
          
        if (error) {
          console.error('Error cancelling trial slot:', error);
          throw error;
        }
      } else {
        // Just update the event if it's an availability event
        const { error } = await supabase
          .from('user_events')
          .update({
            is_blocked: false,
            metadata: {
              ...(typeof eventData.metadata === 'object' ? eventData.metadata : {}),
              booked_by: null,
              booked_at: null
            }
          })
          .eq('id', slotId);
          
        if (error) {
          console.error('Error updating event availability:', error);
          throw error;
        }
      }
      
      // Remove course from student's trial_classes
      // Safely access metadata properties
      const metadata = eventData.metadata as Record<string, any> | null;
      const courseId = metadata && metadata.course_id;
      const studentId = metadata && metadata.student_id;
      
      if (courseId && studentId) {
        // We need to get the current array first
        const { data: userData } = await supabase
          .from('custom_users')
          .select('trial_classes')
          .eq('id', studentId)
          .single();
          
        if (userData && userData.trial_classes) {
          // Filter out the course ID
          const updatedTrialClasses = userData.trial_classes.filter(
            (id: string) => id !== courseId
          );
          
          // Update the user record
          const { error: userError } = await supabase
            .from('custom_users')
            .update({
              trial_classes: updatedTrialClasses
            })
            .eq('id', studentId);
            
          if (userError) {
            console.error('Error updating user trial classes:', userError);
            // Not throwing an error here since the event has been unblocked
          }
        }
      }
      
      // Refresh the list of slots
      fetchMyTrialSlots();
      
      return true;
    } catch (err) {
      console.error('Failed to cancel trial slot:', err);
      return false;
    }
  };

  // Create availability as a teacher
  const createAvailability = async (
    startTime: Date,
    endTime: Date,
    courseId?: string
  ): Promise<boolean> => {
    if (!user || user.role !== 'teacher') return false;
    
    try {
      const { error } = await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          title: courseId ? "Course-specific Availability" : "General Availability",
          description: "Teacher availability for trial classes",
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          event_type: "availability",
          is_blocked: false,
          metadata: courseId ? { course_id: courseId } : {}
        });
        
      if (error) {
        console.error('Error creating availability:', error);
        throw error;
      }
      
      // Refresh the list of slots
      fetchMyTrialSlots();
      
      return true;
    } catch (err) {
      console.error('Failed to create availability:', err);
      return false;
    }
  };

  // Create or update blocked hours
  const setBlockedHours = async (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    reason?: string
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('blocked_hours')
        .upsert({
          user_id: user.id,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          is_recurring: true,
          reason: reason || 'Unavailable'
        }, {
          onConflict: 'user_id, day_of_week, start_time, end_time'
        });
        
      if (error) {
        console.error('Error setting blocked hours:', error);
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error('Failed to set blocked hours:', err);
      return false;
    }
  };

  // Get blocked hours for current user
  const getBlockedHours = useCallback(async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('blocked_hours')
        .select('*')
        .eq('user_id', user.id)
        .order('day_of_week')
        .order('start_time');
        
      if (error) {
        console.error('Error fetching blocked hours:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Failed to fetch blocked hours:', err);
      return [];
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMyTrialSlots();
    }
  }, [user, fetchMyTrialSlots]);

  return {
    myTrialSlots: mySlots,
    loading,
    refreshTrialSlots: fetchMyTrialSlots,
    cancelTrialSlot,
    createAvailability,
    setBlockedHours,
    getBlockedHours
  };
}
