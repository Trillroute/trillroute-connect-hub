
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchUserAvailabilityForWeek } from "@/services/availability/api/userAvailability";
import { UserAvailability } from "@/services/availability/types";
import { Loader2 } from 'lucide-react';
import { fetchOverlappingAvailability } from '@/services/events/api/queries/filter/fetchOverlappingAvailability';

interface TeacherAvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  onSlotSelect: (slot: UserAvailability) => void;
  isGroupCourse?: boolean;
  courseId?: string;
}

const TeacherAvailabilityDialog: React.FC<TeacherAvailabilityDialogProps> = ({ 
  isOpen, 
  onClose,
  teacherId,
  onSlotSelect,
  isGroupCourse = false,
  courseId
}) => {
  const [availabilitySlots, setAvailabilitySlots] = useState<UserAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [groupedSlots, setGroupedSlots] = useState<Record<string, UserAvailability[]>>({});
  
  // Helper function to format day name
  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };
  
  // Format time for display (e.g. 14:30 -> 2:30 PM)
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  // Fetch teacher availability when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const fetchAvailability = async () => {
        setLoading(true);
        try {
          let slots: UserAvailability[] = [];
          
          if (isGroupCourse && courseId) {
            // For group courses, fetch overlapping availability for all teachers
            console.log("Fetching overlapping availability for course:", courseId);
            slots = await fetchOverlappingAvailability(courseId);
          } else if (teacherId) {
            // For solo/duo courses, fetch the selected teacher's availability
            console.log("Fetching availability for teacher:", teacherId);
            slots = await fetchUserAvailabilityForWeek(teacherId);
          }
          
          setAvailabilitySlots(slots);
          
          // Group slots by day for better UI organization
          const grouped: Record<string, UserAvailability[]> = {};
          slots.forEach(slot => {
            const dayName = getDayName(slot.dayOfWeek);
            if (!grouped[dayName]) {
              grouped[dayName] = [];
            }
            grouped[dayName].push(slot);
          });
          setGroupedSlots(grouped);
        } catch (error) {
          console.error("Error fetching availability:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchAvailability();
    }
  }, [isOpen, teacherId, isGroupCourse, courseId]);
  
  // Handle slot selection
  const handleConfirm = () => {
    if (selectedSlotId) {
      const selectedSlot = availabilitySlots.find(slot => slot.id === selectedSlotId);
      if (selectedSlot) {
        onSlotSelect(selectedSlot);
        onClose();
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isGroupCourse 
              ? "Select Time Slot (All Teachers Available)" 
              : "Select Teacher Availability Slot"}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : availabilitySlots.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            {isGroupCourse 
              ? "No common availability slots found for all teachers in this course." 
              : "No availability slots found for this teacher. Please contact them to set up their schedule."}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="availability-slot">Select an available time slot</Label>
              <Select value={selectedSlotId} onValueChange={setSelectedSlotId}>
                <SelectTrigger id="availability-slot">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedSlots).map(([day, slots]) => (
                    <React.Fragment key={day}>
                      <div className="px-2 py-1.5 text-sm font-semibold text-primary-foreground bg-primary/20 my-1">{day}</div>
                      {slots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id}>
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedSlotId || loading}
          >
            Confirm Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherAvailabilityDialog;
