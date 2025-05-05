
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

const mapDbSlotToTrialSlot = (dbSlot: any): TrialSlot => ({
  id: dbSlot.id,
  startTime: new Date(dbSlot.start_time),
  endTime: new Date(dbSlot.end_time),
  courseId: dbSlot.course_id,
  courseTitle: dbSlot.courses?.title,
  teacherId: dbSlot.teacher_id,
  teacherName: dbSlot.teachers ? `${dbSlot.teachers.first_name} ${dbSlot.teachers.last_name}` : undefined,
  isBooked: dbSlot.is_booked,
  studentId: dbSlot.student_id,
  createdAt: new Date(dbSlot.created_at),
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
      let query = supabase.from('teacher_availability')
        .select(`
          *,
          courses:course_id (title),
          teachers:teacher_id (first_name, last_name),
          students:student_id (first_name, last_name)
        `)
        .order('start_time', { ascending: true });

      // If user is a student, get slots booked by them
      if (user.role === 'student') {
        query = query.eq('student_id', user.id);
      } 
      // If user is a teacher, get their available slots
      else if (user.role === 'teacher') {
        query = query.eq('teacher_id', user.id);
      }
      // If user is an admin, they can see all slots
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching trial slots:', error);
        return;
      }
      
      const mappedSlots = data ? data.map(mapDbSlotToTrialSlot) : [];
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
      const { data: slotData } = await supabase
        .from('teacher_availability')
        .select('*')
        .eq('id', slotId)
        .single();
      
      // Update slot to be available again
      const { error } = await supabase
        .from('teacher_availability')
        .update({
          is_booked: false,
          student_id: null
        })
        .eq('id', slotId);
        
      if (error) {
        console.error('Error cancelling trial slot:', error);
        throw error;
      }
      
      // Remove course from student's trial_classes
      if (slotData && slotData.course_id && slotData.student_id) {
        // We need to get the current array first
        const { data: userData } = await supabase
          .from('custom_users')
          .select('trial_classes')
          .eq('id', slotData.student_id)
          .single();
          
        if (userData && userData.trial_classes) {
          // Filter out the course ID
          const updatedTrialClasses = userData.trial_classes.filter(
            (id: string) => id !== slotData.course_id
          );
          
          // Update the user record
          const { error: userError } = await supabase
            .from('custom_users')
            .update({
              trial_classes: updatedTrialClasses
            })
            .eq('id', slotData.student_id);
            
          if (userError) {
            console.error('Error updating user trial classes:', userError);
            // Not throwing an error here since the slot has been unbooked
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
        .from('teacher_availability')
        .insert({
          teacher_id: user.id,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          is_booked: false,
          course_id: courseId
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
    createAvailability
  };
}
