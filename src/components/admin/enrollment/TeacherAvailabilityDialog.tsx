
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';
import { Course } from '@/types/course';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { UserAvailability } from '@/services/availability/types';
import { fetchOverlappingAvailability } from '@/services/events/api/queries/filter/fetchOverlappingAvailability';

interface TeacherAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onSelectSlot: (day: number, startTime: string, endTime: string) => void;
}

const TeacherAvailabilityDialog: React.FC<TeacherAvailabilityDialogProps> = ({
  open,
  onOpenChange,
  course,
  onSelectSlot,
}) => {
  const { toast } = useToast();
  const [teacherAvailability, setTeacherAvailability] = useState<UserAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<UserAvailability | null>(null);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get instructor availability if course is solo or duo
  // For group courses, get overlapping availability of all instructors
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!open || !course) return;
      
      setLoading(true);
      try {
        let availabilityData: UserAvailability[] = [];
        
        if (course.course_type === 'group' && Array.isArray(course.instructor_ids) && course.instructor_ids.length > 1) {
          // For group courses, get overlapping availability
          availabilityData = await fetchOverlappingAvailability(course.instructor_ids);
        } else if (Array.isArray(course.instructor_ids) && course.instructor_ids.length === 1) {
          // For solo/duo with a single instructor
          const { data, error } = await useStaffAvailability(course.instructor_ids[0]);
          if (error) {
            throw new Error(error.message);
          }
          availabilityData = data || [];
        }
        
        setTeacherAvailability(availabilityData);
      } catch (error) {
        console.error('Error fetching teacher availability:', error);
        toast({
          title: 'Error',
          description: 'Failed to load teacher availability.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [open, course, toast]);

  const handleSlotClick = (slot: UserAvailability) => {
    setSelectedSlot(slot);
  };

  const handleConfirmSlot = () => {
    if (selectedSlot) {
      onSelectSlot(selectedSlot.day_of_week, selectedSlot.start_time, selectedSlot.end_time);
      onOpenChange(false);
    }
  };

  const formatTime = (timeString: string) => {
    // Handle PostgreSQL time format (e.g., "14:00:00")
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      return format(new Date().setHours(Number(hours), Number(minutes)), 'h:mm a');
    }
    return timeString;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Teacher Availability</DialogTitle>
          <DialogDescription>
            Select a time slot that works for you.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-72 mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading availability...</p>
            </div>
          ) : teacherAvailability.length === 0 ? (
            <div className="p-4 text-center">
              <p>No availability found for this teacher.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dayNames.map((day, dayIndex) => {
                const daySlots = teacherAvailability.filter(
                  (slot) => slot.day_of_week === dayIndex
                );

                if (daySlots.length === 0) return null;

                return (
                  <div key={day} className="mb-4">
                    <h3 className="font-medium text-sm mb-2">{day}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-2 border rounded-md cursor-pointer text-sm transition-colors ${
                            selectedSlot?.id === slot.id
                              ? 'bg-music-100 border-music-500'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleSlotClick(slot)}
                        >
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSlot}
            disabled={!selectedSlot || loading}
          >
            Select Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherAvailabilityDialog;
