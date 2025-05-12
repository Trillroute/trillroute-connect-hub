
import React from 'react';
import { format } from 'date-fns';
import { Clock, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AvailabilitySlot } from '@/services/availability/teaching';

interface TimeSlotsSelectorProps {
  loading: boolean;
  availableSlots: AvailabilitySlot[];
  selectedSlot: AvailabilitySlot | null;
  onSelectSlot: (slot: AvailabilitySlot) => void;
  date: Date | undefined;
}

export const TimeSlotsSelector: React.FC<TimeSlotsSelectorProps> = ({
  loading,
  availableSlots,
  selectedSlot,
  onSelectSlot,
  date
}) => {
  const formatTimeSlot = (slot: AvailabilitySlot) => {
    const startTime = format(new Date(slot.startTime), 'h:mm a');
    const endTime = format(new Date(slot.endTime), 'h:mm a');
    return `${startTime} - ${endTime}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Available Time Slots
      </label>
      <Card>
        <CardContent className="p-2">
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : availableSlots.length > 0 ? (
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => onSelectSlot(slot)}
                  >
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{formatTimeSlot(slot)}</span>
                    </div>
                    {slot.teacherName && (
                      <Badge variant="outline">{slot.teacherName}</Badge>
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex justify-center items-center h-[200px] text-center text-muted-foreground">
              {date ? "No available slots for this date" : "Please select a date"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
