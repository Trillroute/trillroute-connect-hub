
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AvailabilitySlot, bookTrialClass } from '@/services/availability/teaching';
import { fetchAvailableSlotsForCourse } from '@/services/availability/teaching';

interface UseBookTrialDialogProps {
  courseId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const useBookTrialDialog = ({ courseId, onClose, onSuccess }: UseBookTrialDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Fetch available slots when the dialog opens or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const slots = await fetchAvailableSlotsForCourse(courseId);
        
        // Filter slots for the selected date if a date is selected
        const filteredSlots = date 
          ? slots.filter(slot => {
              const slotDate = new Date(slot.startTime);
              return slotDate.toDateString() === date.toDateString();
            })
          : slots;
        
        setAvailableSlots(filteredSlots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [courseId, date, toast]);

  const handleBookTrial = async () => {
    if (!selectedSlot || !user?.id) {
      toast({
        title: "Error",
        description: "Please select a time slot first",
        variant: "destructive",
      });
      return;
    }

    setBookingInProgress(true);
    try {
      const success = await bookTrialClass(selectedSlot.id, user.id, courseId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Your trial class has been booked!",
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to book the trial class. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error booking trial:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setBookingInProgress(false);
    }
  };

  return {
    date,
    setDate,
    availableSlots,
    selectedSlot,
    setSelectedSlot,
    loading,
    bookingInProgress,
    handleBookTrial
  };
};
