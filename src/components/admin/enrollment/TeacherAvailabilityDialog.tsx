
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';
import { UserAvailability } from '@/services/availability/types';
import { format, parse } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserAvailability } from '@/hooks/useUserAvailability';

interface TeacherAvailabilityDialogProps {
  open: boolean;
  onClose: () => void;
  teacherId: string;
  onSlotSelect: (slot: UserAvailability) => void;
  isGroupCourse?: boolean;
  courseId?: string;
}

const TeacherAvailabilityDialog: React.FC<TeacherAvailabilityDialogProps> = ({
  open,
  onClose,
  teacherId,
  onSlotSelect,
  isGroupCourse = false,
  courseId
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  // Use useUserAvailability for the teacher's availability
  const { dailyAvailability, loading: isLoading } = useUserAvailability(teacherId);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const availabilityByDay = useMemo(() => {
    const byDay: Record<number, UserAvailability[]> = {};
    
    for (let i = 0; i < 7; i++) {
      byDay[i] = [];
    }
    
    if (dailyAvailability) {
      dailyAvailability.forEach(day => {
        if (day.dayOfWeek >= 0 && day.dayOfWeek < 7) {
          byDay[day.dayOfWeek] = day.slots || [];
        }
      });
    }
    
    // Sort by start time in each day
    Object.keys(byDay).forEach(day => {
      const dayIndex = parseInt(day);
      byDay[dayIndex] = byDay[dayIndex].sort((a, b) => {
        const timeA = parse(a.startTime, 'HH:mm:ss', new Date());
        const timeB = parse(b.startTime, 'HH:mm:ss', new Date());
        return timeA.getTime() - timeB.getTime();
      });
    });
    
    return byDay;
  }, [dailyAvailability]);

  const formatTimeRange = (slot: UserAvailability) => {
    try {
      const start = parse(slot.startTime, 'HH:mm:ss', new Date());
      const end = parse(slot.endTime, 'HH:mm:ss', new Date());
      return `${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')}`;
    } catch (error) {
      console.error('Error formatting time range:', error);
      return `${slot.startTime} - ${slot.endTime}`;
    }
  };

  const handleSlotSelect = (slot: UserAvailability) => {
    console.log('Slot selected in dialog:', slot);
    // Pass the complete slot data with all necessary information
    onSlotSelect({
      ...slot,
      // Ensure we have the day of week from the slot data
      dayOfWeek: slot.dayOfWeek
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Available Time Slot</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="0" onValueChange={(value) => setSelectedDay(parseInt(value))}>
          <TabsList className="w-full overflow-auto">
            {dayNames.map((day, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()}
                className="flex-1"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {dayNames.map((day, index) => (
            <TabsContent key={index} value={index.toString()}>
              <div className="py-4">
                <h3 className="text-lg font-medium mb-3">{day} Available Slots</h3>
                
                {isLoading ? (
                  <p>Loading availability slots...</p>
                ) : availabilityByDay[index]?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {availabilityByDay[index].map(slot => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="justify-start p-4 h-auto hover:bg-blue-50 border-blue-200"
                        onClick={() => handleSlotSelect(slot)}
                      >
                        <div>
                          <div className="font-medium">{formatTimeRange(slot)}</div>
                          {slot.category && (
                            <div className="text-xs text-muted-foreground">{slot.category}</div>
                          )}
                          <div className="text-xs text-green-600 mt-1">
                            Click to book this slot
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No availability slots for this day.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherAvailabilityDialog;
